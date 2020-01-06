const express = require('express');
const router = express.Router();
const redisConnection = require('../src/RedisConnection.js');

var types=["desert","lunch","dinner","breakfast"];
router.get('/',(req,res)=>{
    res.send("This is path for Posts in Neo4J");
});

router.post('/createPost', (req, res) =>
{ 
  var ourdate=new Date();
   
  const post = {
    tittle: req.body.tittle,
    description:req.body.description,
    createdAt:ourdate.toISOString()
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(post:Post {tittle:{tittle}}) return post',
  { tittle:post.tittle })
    .then((result)=> {
      if((result.records.length)!=0){
        const error =  {
          message : 'Tittle is already in use',
          status : 400
        }
        throw error;
      }
      else { 
        neo4jClient.session.run('Match (user:User {username:{username}})'+
                              'CREATE (post:Post {tittle:{tittle}'+
                              ',description : {description}, createdAt : {createdAt}})'+
                              'Create (user)-[r:Posted]->(post) return r',
                              {
                                username:req.body.username,
                                ...post
                              })
                                .then(results => {
                                  Promise.all( req.body.type.map(type=>{
                                    var session = neo4jClient.driver.session();
                                    return session.run('Match (post:Post {tittle:{tittle}})'+
                                    'MERGE (type:Type {type:{type}})'+
                                    'Create (post)-[r:IsOf]->(type)',
                                    {
                                      tittle:post.tittle,
                                      type:type
                                    });
                                  })).then(data=>{
                                    var object={
                                      message:"Post created",
                                      status:200
                                    }
                                    res.send(object)
                                  });
                                
                                
                                }).catch(error=>res.send(error));
      }}).catch(error=>res.send(error));
});

router.get('/getAllPosts',function(req,res){

  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(post:Post) return post')
  .then((result)=>
         {
          if((result.records.length)==0)
          {
            const error =  {
              username : 'no posts found',
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
          
           )
           res.send(postArray)
         } 
          
         })
         .catch((error)=>{
              res.send(error);
         }
         )




})

router.get('/getPostByUser/:username', function(req, res, next) 
{ 

  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('Match(user:User {username: {username}})-[:Posted]->(post) return post',{username:req.params.username})
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

router.get('/getPost/:title', function(req, res, next) 
{ console.log(req.params.title)
  redisConnection.createConnection().then((client)=>{
    client.hgetall('post:'+req.params.title,(err,results)=>{
      if (results===null) {
        console.log("Radi");
        var neo4jClient = require('../src/Neo4JConnection');
        neo4jClient.session.run('Match(post:Post {tittle: {title}}) return post',{title:req.params.title})
        .then((result)=>{
          if((result.records.length)==0){
            const error =  {
              message : 'No post found',
              status : 400
            }
            throw error;
          } else{
            var myPost=result.records[0].get('post').properties;
            redisConnection.createConnection().then((client)=>{
              client.hmset(['post:'+req.params.title,"title",myPost.tittle,"description",myPost.description,"createdAt",myPost.createdAt],(err,result)=>{
                if(err)
                console.log(err)
                else
                  client.expire('post:'+req.params.title,300);
              })})
            const object =  {
              message : 'Post found',
              post:myPost,
              status : 200
            }
            res.send(object)
          }})
          .catch((error)=>{
            res.send(error);
          })   
      } else {
        const object =  {
          message : 'Post found',
          post:results,
          status : 200
        }
        res.send(object);
      }
    })
  });
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