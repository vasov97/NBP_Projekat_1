const express = require('express');
const router = express.Router();
const redisConnection = require('../src/RedisConnection.js');

router.get('/',(req,res)=>{
    res.send("This is path for Posts in Neo4J");
});

router.post('/createPost', (req, res) =>{ 
  var ourdate=new Date();
   
  const post = {
    title: req.body.title,
    description:req.body.description,
    createdAt:ourdate.toISOString()
  }
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('MATCH (post:Post {title:{title}}) return post', { title:post.title })
  .then((result)=> {
    if((result.records.length)!=0)
      throw neo4jClient.createError('Title is already in use');
    else { 
      neo4jClient.session.run('MATCH (user:User {username:{username}})'+
      'CREATE (post:Post {title:{title}, description : {description}, createdAt : {createdAt}})'+
      'CREATE (user)-[r:Posted]->(post) return r',{ username:req.body.username, ...post })
        .then(results => {
          Promise.all( req.body.types.map(type=>{
            var session = neo4jClient.driver.session();
            return session.run('MATCH (post:Post {title:{title}})'+
            'MERGE (type:Type {type:{type}})'+
            'CREATE (post)-[r:IsOf]->(type)',{ title:post.title, type:type });
          })).then(data=>{
            res.send(neo4jClient.createResponse("Post created"));
          });
        }).catch(error=>res.send(error));
    }
  }).catch(error=>res.send(error));
});

router.get('/getAllPosts',function(req,res){
  
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('MATCH(post:Post) RETURN post ORDER BY post.createdAT LIMIT 25')
  .then((result)=>{
    if((result.records.length)==0)
      throw neo4jClient.createError("No posts found.");
    else{
      var postArray=[];
      result.records.forEach(record=>postArray.push({...record.get('post').properties}));
      postArray.map(singlePost=>{
        redisConnection.createConnection().then(client=>{
          client.hmset(['post:'+singlePost.title,"title",singlePost.title,
          "description",singlePost.description,
          "createdAt",singlePost.createdAt],(err,result)=>{
            if(err)
              console.log(err);
            else{
              console.log(result);
              client.expire('post:'+singlePost.title,300);
            }
          });
        });
      });
      res.send(neo4jClient.createResponse("Posts",postArray));
    } 
  })
  .catch((error)=>{
    res.send(error);
  })
});

router.get('/getPostsByUser/:username', function(req, res, next) 
{
  var neo4jClient = require('../src/Neo4JConnection');
  neo4jClient.session.run('MATCH (user:User {username: {username}})-[:Posted]->(post) RETURN post',{username:req.params.username})
  .then((result)=>{
    if((result.records.length)==0)
      throw neo4jClient.createError('User has no posts');
    else{
      var postArray=[];
      result.records.forEach(record=>postArray.push({ ...record.get('post').properties }));
      postArray.map(singlePost=>{
        redisConnection.createConnection().then(client=>{
          client.hmset(['post:'+singlePost.title,"title",singlePost.title,
          "description",singlePost.description,
          "createdAt",singlePost.createdAt],(err,result)=>{
            if(err)
              console.log(err);
            else{
              client.expire('post:'+singlePost.title,300);
            }
          });
        });
      });
      res.send(neo4jClient.createResponse("Posts",postArray))
    }
  })
  .catch((error)=>{
    res.send(error);
  })
});

router.get('/getPost/:title', function(req, res, next) 
{
  redisConnection.createConnection().then((client)=>{
    client.hgetall('post:'+req.params.title,(err,results)=>{
      if (results===null) {
      var neo4jClient = require('../src/Neo4JConnection');
      neo4jClient.session.run('MATCH (post:Post {title: {title}}) RETURN post',{title:req.params.title})
        .then((result)=>{
          if((result.records.length)==0)
            throw neo4jClient.createError("No post found");
          else{
            var myPost=result.records[0].get('post').properties;
            redisConnection.createConnection().then((client)=>{
              client.hmset(['post:'+req.params.title,"title",myPost.title,"description",myPost.description,"createdAt",myPost.createdAt],(err,result)=>{
                if(err)
                console.log(err)
                else
                  client.expire('post:'+req.params.title,300);
              })})
            res.send(neo4jClient.createResponse("Post found",myPost));
          }})
        .catch((error)=>{
            res.send(error);
        })   
      } else 
        res.send(neo4jClient.createResponse("Post found",results));
    })
  });
});

router.get('/getPostsOfType/:type',(req,res)=>{
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    queryString = "MATCH (post:Post)-[:IsOf]->(type:Type) WHERE type.name=$nameOfType";
    
    session.run(queryString,{nameOfType:req.params.type}).then((result)=>{
        let posts = [];
        result.records.forEach((singleRecord)=>{posts.push(getPostFromRecord(singleRecord));});
        //KESIRANJE NECEGA
        session.close();
        res.send(posts);
    })
});

router.get('/getTypesOfPost/:title',(req,res)=>{
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    queryString = "MATCH (post:Post)-[:IsOf]->(type:Type) WHERE post.title=$postTitle RETURN type";
    
    session.run(queryString,{postTitle:req.params.title}).then((result)=>{
        let types = [];

        result.records.forEach((singleRecord)=>{types.push(getTypeFromRecord(singleRecord));});
        redisConnection.createConnection().then(client=>{
          types.forEach(singleType=>{
            client.rpush("type:"+req.params.title,singleType.type);
          })
          client.expire("type:"+req.params.title,500);
        })
        session.close();
        res.send(types);
    })
});

function getPostFromRecord(record){
    var myPost = {
        title:record._fields[0].properties.title,
        description:record._fields[0].properties.description,
        createdAt:record._fields[0].properties.createdAt
    }
    return myPost;
}

function getTypeFromRecord(record){
    var myType={
        type:record._fields[0].properties.type
    }
    return myType;
}

module.exports=router;