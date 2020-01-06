var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) 
{ 
  res.send('Neo4J for Users');
});

router.post('/createUser', (req, res) =>{ 
  console.log(req.body)
  const user = {
    username : req.body.username,
    password : hash(req.body.password,{salt:req.body.username}),
    email : req.body.email 
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match (user:User {email: {email}}) return user',{email:user.email})
    .then((result)=>{
        if((result.records.length)!=0){
           
          const error =  {
            message : 'Email is already in use',
            status : 400
          }
          throw error;
        }
        else{
            
          neo4jClient.session.run("Match (user:User {username:{username}}) return user",{username:user.username})
          .then((result)=>{
            if((result.records.length)!=0){
           
              const error =  {
                message : 'Username is already in use',
                status : 400
              }
              throw error;
            }
            else
            {
              neo4jClient.session.run('CREATE (user:User {username :{username}, password : {password}, email : {email}}) return user',
              {
                ...user
              }).then(results => {
                var object={
                  message:"Profile created!",
                  status:200,
                 
                }
                res.send(object)
              });
            }
          })
          .catch(error=>res.send(error))
        }}).catch(error=>res.send(error))
});

router.post('/login', function(req, res) 
{ 
  const user = {
    username : req.body.username,
    password : req.body.password
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(user:User {username: {username}}) return user',{username:user.username})
  .then((result)=>{
    if(result.records.length==0){
      const error =  {
        message : "User not found",
        status : 400
      }
      throw error;
      }
      else {
        const newUser = result.records[0].get('user');
        if(compare(user.password,newUser.properties.password))
          { 
            var object={
            message:"Loging in!",
            user:newUser.properties,
            status:200
          }
            res.send(object);
          }
        else {
          const error =  {
            message : 'Wrong password',
            status : 400
          }
          throw error;
        }
      }
  }).catch(error=>res.send(error))
});

router.post('/likePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  let datum=new Date().toLocaleDateString('en-GB',{timeZone:'UTC'});
  let queryString="MATCH (user:User), (post:Post) WHERE ID(user)=$userId AND ID(post)=$postId "
                + "MERGE (user)-[l:Likes]->(post) "
                + "ON CREATE SET l.date=$date";
  session.run(queryString,{
    userId:parseInt(req.body.userId),
    postId:parseInt(req.body.postId),
    date:datum
  })
    .then((result)=>{
        res.send({queryResult:true});
        session.close();
    })
    .catch(error=>{
        res.send({queryResult:false});
        session.close();
    });
});

router.post('/unlikePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  let queryString = "MATCH (user:User),(post:Post) WHERE ID(user)=$userId AND ID(post)=$postId "
                  + "OPTIONAL MATCH (user)-[l:Likes]-(post) DELETE l"
  session.run(queryString,{
    userId:parseInt(req.body.userId),
    postId:parseInt(req.body.postId)
  })
    .then((result)=>{
        res.send({queryResult:true});
        session.close();
    })
    .catch(error=>{
        res.send(NeoClient.session);
        res.send({queryResult:false});
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

const md5 = require("md5");

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
