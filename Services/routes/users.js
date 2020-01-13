const connectionResponse = require('../src/ConnectionResponse');
const userQueries = require('../queries/userQueries');
const redisConnection = require('../src/RedisConnection');
const express = require('express');
const md5 = require("md5");
const router = express.Router();

router.get('/', function(req, res, next) 
{ 
  res.send('Route for Users');
});

router.post('/createUser', (req, res) =>{ 
  const user = {
    username : req.body.username,
    password : hash(req.body.password,{salt:req.body.username}),
    email : req.body.email 
  }
  var neoClient = require('../src/Neo4JConnection');
  const session = neoClient.driver.session();
  session.run(userQueries.matchUserByEmail,{ email:user.email })
  .then((result)=>{
    if((result.records.length)!=0){
      session.close();
      res.send(connectionResponse.createError("400","Email is already in use"));
    }
    else{
      session.run(userQueries.matchUserByUsername,{ username:user.username })
      .then((result)=>{
        if((result.records.length)!=0){
          session.close();
          res.send(connectionResponse.createError("400","Username is already in use"));
        }
        else{
          session.run(userQueries.createUser,{ ...user })
          .then(results => {
            res.send( connectionResponse.createResponse("200","Profile created!") );
            session.close();
          });
        }
      }).catch(error=>{
        res.send(connectionResponse.createError("500","Server error"));
        session.close();
      })
    }})
  .catch(error=>{
    res.send(connectionResponse.createError("500","Server error"));
    session.close();
  })
});

router.post('/login', (req, res) =>{ 
  const user = {
    username : req.body.username,
    password : req.body.password
  }
  var neo4jClient = require('../src/Neo4JConnection');
  const session = neo4jClient.driver.session();
  session.run(userQueries.matchUserByUsername,{username:user.username})
  .then((result)=>{
    if(result.records.length==0){
      session.close()
      res.send(connectionResponse.createError("400","Wrong username"));
    }
    else {
      const newUser = result.records[0].get('user');
      cacheLogIn(newUser.properties);
      if(compare(user.password, newUser.properties.password))
        res.send(connectionResponse.createResponse("200","Loging in!",newUser.properties));
      else
        res.send(connectionResponse.createError("404","Wrong password"));
      session.close();
    }
  }).catch(error=>{
    connectionResponse.createError("500","Server error")
    session.close();
  });
});

router.post('/likePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  session.run(userQueries.likePost,{
    username:req.body.username,
    postTitle:req.body.postTitle,
    date:req.body.date
  })
  .then((result)=>{
    res.send(connectionResponse.createResponse("200","Like created"));
    session.close();
  })
  .catch(error=>{
    res.send(connectionResponse.createError("500","Server error"));
    session.close();
  });
});

router.post('/dislikePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  session.run(userQueries.dislikePost,{
    username:req.body.username,
    postTitle:req.body.postTitle,
  })
  .then((result)=>{
    res.send(connectionResponse.createResponse("200","Post is disliked"));
    session.close();
  })
  .catch(error=>{
    res.send(connectionResponse.createError("500","Server error"));
    session.close();
  });
});

router.get('/getUser/:username', (req, res)=> 
{ 
  var neo4jClient = require('../src/Neo4JConnection');
  const session = neo4jClient.driver.session();
  session.run(userQueries.matchUserByUsername,{username:req.params.username})
  .then((result)=>{
    if(!result.records){
      res.send(connectionResponse.createError("404","User not found"))
    }
    else{
      res.send(result.records[0].get('user'));
    }}).catch((error)=>{
      res.send(error);
    })
});

router.get('/getLogedUser/:username',(req,res)=>{
  redisConnection.createConnection().then(client=>{
    cashId = "logedInUser:"+req.params.username;
    client.hgetall(cashId,(err,result)=>{
      if(error)
        res.send(connectionResponse.createError("500","Server error"));
      else if(result == null)
        res.send(connectionResponse.createError("404","User not logged"));
      else 
        res.send(connectionResponse.createResponse("200","User found",result));
    })
  })
});

router.get('/logoutUser/:username',(req,res)=>{
  redisConnection.createConnection().then(client=>{
    cacheId = 'logedInUser:'+req.params.username;
    client.exists(cacheId,(err,result)=>{
      if(result){
        client.del(cacheId,(err,result)=>{
          if(err){
            res.send(connectionResponse.createError("500","Server error"));
          }
          else if (result){
            res.send(connectionResponse.createResponse("200","User logedout",true));
          }
        })
      }
      else{
        res.send(connectionResponse.createError("404","User not loged in"))
      }
    });
  })
})

function cacheLogIn(userProperties){
  const cacheId = 'logedInUser:'+userProperties.username;
  redisConnection.createConnection().then(client=>{
    client.hmset([cacheId,
      "username",userProperties.us,
      "email",user.properties.email]);
  });
}

function hash(rawPassword, options = {}) {

  const salt = options.salt ? options.salt : new Date().getTime();
  const rounds = options.rounds ? options.rounds : 10;
  let hashed = md5(rawPassword + salt);
  for (let i = 0; i <= rounds; i++) {
    hashed = md5(hashed);
  }
  return `${salt}$${rounds}$${hashed}`;
}
  
function compare(rawPassword, hashedPassword) {
  try {
    const [ salt, rounds ] = hashedPassword.split('$');
    const hashedRawPassword = hash(rawPassword, { salt, rounds });
    if(hashedPassword === hashedRawPassword)
      return true;
    else return false;
  } catch (error) {
    throw Error(error.message);
  }
}

module.exports = router;
