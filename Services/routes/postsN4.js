const express = require('express');
const router = express.Router();

var types=["desert","lunch","dinner","breakfast"];
router.get('/',(req,res)=>{
    res.send("This is path for Posts in Neo4J");
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

router.post('/getPostsOfType',(req,res)=>{
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    queryString = "MATCH (post:Post)-[:IsOf]->(type:Type) WHERE type.name=$nameOfType";
    
    session.run(queryString,{nameOfType:req.body.nameOfType}).then((result)=>{
        let posts = [];
        result.records.forEach((singleRecord)=>{comments.push(getPostFromRecord(singleRecord));});
        session.close();
        res.send(comments);
    })
});

router.post('/getTypesOfPost',(req,res)=>{
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    queryString = "MATCH (post:Post)-[:IsOf]->(type:Type) WHERE ID(post)=$postId";
    
    session.run(queryString,{nameOfType:req.body.postId}).then((result)=>{
        let types = [];
        result.records.forEach((singleRecord)=>{comments.push(getTypeFromRecord(singleRecord));});
        session.close();
        res.send(comments);
    })
});

function getPostFromRecord(record){
    var myPost = {
        id:record._fields[0].identity.low,
        text:record._fields[0].properties.name,
        ingredients:record._fields[0].properties.ingredients
    }
    return myPost;
}

function getTypeFromRecord(record){
    var myType={
        id:record._fields[0].identity.low,
        name:record._fields[0].properties.name
    }
}

module.exports=router;