var express = require('express');
var router = express.Router();




/* GET recepies listing. */
router.get('/', function(req, res, next) 
{ 
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(osoba:Person) return osoba')
         .then((result)=>
         {
            result.records.
            forEach(element => {
              console.log(element._fields[0].properties.name)
            }); 
         })
         .catch((error)=>{
              console.log(error)
         }
         )
  res.send('Neo4J for Users');
});

router.post('/createUser', (req, res) =>
{ 
  const user = 
  {
    username : req.body.username,
    email : req.body.email,
    password : hash(req.body.password,{salt:req.body.username})
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(user:User {username: {username}}) return user',{username:user.username})
         .then((result)=>
         {
            if(!(result.records))
              {
                const error =  {
                  username : '${user.username} is already in use',
                  status : 400
                }
                throw error;
              }
              else
              {
                neo4jClient.session.run('CREATE (user:User {username :{username}, password : {password}, email : {email}}) return user',
                {
                  
                  username : user.username,
                  password : user.password,
                  email : user.email
                }).then(results => {res.send(results.records[0].get('user'))});
              } 
         }).catch(error=>res.send(error))
});


router.post('/login', function(req, res) 
{ 
  const user = 
  {
    username : req.body.username,
    email : req.body.email,
    password : req.body.password
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(user:User {username: {username}}) return user',{username:user.username})
  .then((result)=>
  {
     if(!(result.records))
       {
         const error =  {
           username : '${user.username} is already in use',
           status : 400
         }
         throw error;
       }
       else
       {
         const newUser = result.records[0].get('user');
        
        if(compare(user.password,newUser.properties.password))
             res.send(newUser);
        else 
        {
          const error =  {
            username : 'Wrong password',
            status : 400
          }
          throw error;
        }
       }
       } 
  ).catch(error=>res.send(error))
});


router.get('/getUser/:username', function(req, res, next) 
{ 
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(user:User {username: {username}}) return user',{username:req.params.username})
  .then((result)=>
         {
          if(!(result.records))
          {
            const error =  {
              username : 'User not found',
              status : 400
            }
            throw error;
          }
          else
          {
           res.send(result.records[0].get('user'));
          } 
          
         })
         .catch((error)=>{
              res.send(error);
         }
         )
  
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
    } catch (error) 
    {
      throw Error(error.message);
    }
  }


module.exports = router;
