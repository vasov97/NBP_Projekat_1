var express = require('express');
const md5 = require("md5");
var router = express.Router();


router.get('/', function(req, res, next) 
{ 
  res.send('Neo4J for Users');
});

router.post('/createUser', (req, res) =>{ 
  const user = {
    username : req.body.username,
    password : hash(req.body.password,{salt:req.body.username}),
    email : req.body.email 
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('MATCH (user:User {email: {email}}) return user',{email:user.email})
  .then((result)=>{
    if((result.records.length)!=0)
      throw neo4jClient.createError("Email is already in use");
    else{
      neo4jClient.session.run("MATCH (user:User {username:{username}}) return user",{username:user.username})
      .then((result)=>{
        if((result.records.length)!=0)
          throw neo4jClient.createError("Username is already in use");
        else{
          neo4jClient.session.run('CREATE (user:User {username :{username},'+
          'password : {password}, email : {email}}) return user',{ ...user })
          .then(results => {
            res.send(neo4jClient.createResponse("Profile created!"));
          });
        }
      }).catch(error=>res.send(error))
    }})
  .catch(error=>res.send(error))
});

router.post('/login', function(req, res) 
{ 
  const user = {
    username : req.body.username,
    password : req.body.password
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('MATCH (user:User {username: {username}}) return user',{username:user.username})
  .then((result)=>{
    if(result.records.length==0)
      throw neo4jClient.createError("User not found");
    else {
      const newUser = result.records[0].get('user');
      if(compare(user.password,newUser.properties.password))
        res.send(neo4jClient.createResponse("Loging in!",newUser.properties));
      else 
        throw neo4jClient.createError("Wrong password");
    }
  }).catch(error=>res.send(error))
});

router.post('/likePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  let queryString="MATCH (user:User), (post:Post) WHERE user.username=$username AND post.title=$postTitle "
                + "MERGE (user)-[l:Likes]->(post) "
                + "ON CREATE SET l.date=$date";
  session.run(queryString,{
    username:req.body.username,
    postTitle:req.body.postTitle,
    date:req.body.date
  })
  .then((result)=>{
    res.send(NeoClient.createResponse("Like created"));
    session.close();
  })
  .catch(error=>{
    res.send(NeoClient.createError("Unable to like post"));
    session.close();
  });
});

router.post('/unlikePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  let queryString = "MATCH (user:User),(post:Post) WHERE user.username=$username AND post.title=$postTitle "
                  + "OPTIONAL MATCH (user)-[l:Likes]-(post) DELETE l"
  session.run(queryString,{
    username:req.body.username,
    postTitle:req.body.postTitle,
  })
  .then((result)=>{
    res.send(NeoClient.createResponse("Post is disliked"));
    session.close();
  })
  .catch(error=>{
    res.send(NeoClient.createError("Unable to dislike post"));
    session.close();
  });
});

router.get('/getUser/:username', function(req, res, next) 
{ 
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(user:User {username: {username}}) return user',{username:req.params.username})
  .then((result)=>{
    if(!(result.records)){
      const error =  {
        username : 'User not found',
        status : 400
      }
      throw error;
    }
    else{
      res.send(result.records[0].get('user'));
    }}).catch((error)=>{
      res.send(error);
    })
});



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
