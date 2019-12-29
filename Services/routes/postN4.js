var express = require('express');
var router = express.Router();

var types=["desert","lunch","dinner","breakfast"];


/* GET recepies listing. */
router.get('/', function(req, res, next) 
{ 
  
  res.send('Neo4J for POSTS!!!');
});

router.post('/createPost', (req, res) =>
{ 
  var ourdate=new Date();
   
  const post = 
  {
    tittle: req.body.tittle,
    description:req.body.description,
    type:req.body.type,
    createdAt:ourdate.toISOString()
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(post:Post {tittle:{tittle}}) return post',
  {
    tittle:post.tittle})
         .then((result)=>
         {
            if((result.records.length)!=0)
              {
                const error =  {
                  username : '${post.tittle} is already in use',
                  status : 400
                }
                throw error;
              }
              else
              { 
                 if(types.includes(post.type))
                 {
                    neo4jClient.session.run('CREATE (post:Post {tittle:{tittle}'+
                    ',description : {description}, type : {type}, createdAt : {createdAt}}) return post',
                {
                   
                     ...post 
                 
                }).then(results => {

                  
                    
                    neo4jClient.session.run('Match (user:User {username:{username}}), (post:Post {tittle:{tittle}})'+
                    'MERGE (user)-[r:Posted]-(post) return r',
                    {
                        username:req.body.username,
                        tittle:post.tittle
                    })
                    .then(results=> res.send(results.records[0].get('r')))
                    .catch(error=> res.send(error))
                    
                    
                
                
                });
                 }
                 else
                 {
                    const error =  {
                        username : '${post.type} is not valid',
                        status : 400
                      }
                      throw error;
                 } 
            } 
               
         }).catch(error=>res.send(error))
});


router.get('/getPostByUser/:username', function(req, res, next) 
{ 

  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(user:User {username: {username}})-[:Posted]-(post) return post',{username:req.params.username})
  .then((result)=>
         {
          if((result.records.length)==0)
          {
            const error =  {
              username : 'User has no posts',
              status : 400
            }
            throw error;
          }
          else
          {
           var postArray=[];
           result.records.forEach(record=>
            
             postArray.push({
                 ...record.get('post').properties

             })
           //res.send(result.records[0].get('post'));
           )
           res.send(postArray)
         } 
          
         })
         .catch((error)=>{
              res.send(error);
         }
         )
  
});

router.get('/getPostByType/:type', function(req, res, next) 
{ 
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(post:Post {type: {type}}) return post',{type:req.params.type})
  .then((result)=>
         {
          if((result.records.length)==0)
          {
            const error =  {
              username : 'No posts found',
              status : 400
            }
            throw error;
          }
          else
          {
            var postArray=[];
            result.records.forEach(record=>
             
              postArray.push({
                  ...record.get('post').properties
 
              })
            //res.send(result.records[0].get('post'));
            )
            res.send(postArray)
          } 
          
         })
         .catch((error)=>{
              res.send(error);
         }
         )
  
});

router.get('/getPost/:tittle', function(req, res, next) 
{ 
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(post:Post {tittle: {tittle}}) return post',{tittle:req.params.tittle})
  .then((result)=>
         {
          if((result.records.length)==0)
          {
            const error =  {
              username : 'No post found',
              status : 400
            }
            throw error;
          }
          else
          {
            
            res.send(result.records[0].get('post'))
          } 
          
         })
         .catch((error)=>{
              res.send(error);
         }
         )
  
});

module.exports = router;
