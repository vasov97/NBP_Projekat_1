const postQueries = require('../queries/postsQueries');
const connectionResponse = require('../src/ConnectionResponse');
const express = require('express');
const router = express.Router();
const redisConnection = require('../src/RedisConnection.js');

router.get('/',(req,res)=>{
    res.send("This is path for Posts");
});

router.post('/createPost', (req, res) =>{
  let date = new Date();
  const post = {
    title: req.body.title,
    description:req.body.description,
    createdAt:date.toISOString()
  }
  var neo4jClient = require('../src/Neo4JConnection');
  const session = neo4jClient.driver.session();
  session.run(postQueries.matchPostByTitle, { title:post.title })
  .then((result)=> {
    if((result.records.length)!=0){
      session.close();
      res.send(connectionResponse.createError("400",'Title is already in use'));
    }
    else { 
      session.run(postQueries.createPost,{ username:req.body.username, ...post })
      .then(results => {
        Promise.all( req.body.types.map(type=>{
          var session = neo4jClient.driver.session();
          return session.run(postQueries.connectPostTypes,{ title:post.title, type:type });
        })).then(data=>{
          res.send(connectionResponse.createResponse("200","Post created"));
          session.close();
        });
      }).catch(error=>{
        res.send(connectionResponse.createError("500","Server error"));
        session.close();
      });
    }
  }).catch(error=>{
    res.send(connectionResponse.createError("500","Server error"));
    session.close();
  });
});

router.get('/getTopPosts',(req,res)=>{

  const neo4jClient = require('../src/Neo4JConnection');
  const session = neo4jClient.driver.session();
  session.run(postQueries.getNewestPosts)
  .then((result)=>{
    if((result.records.length)==0){
      res.send(connectionResponse.createError("404","No posts found."));
      session.close();
    }
    else{
      var postArray=[];
      result.records.forEach(record=>postArray.push({...record.get('post').properties}));
      session.close()
      postArray.map(singlePost=>{
        redisConnection.createConnection().then(client=>{
          client.hmset(['post:'+singlePost.title,"title",singlePost.title,
          "description",singlePost.description,
          "createdAt",singlePost.createdAt],(err,result)=>{
            if(err){
              console.log(err);
              client.quit();
            }
            else{
              console.log(result);
              client.expire('post:'+singlePost.title,300);
              client.quit()
            }
          });
        });
      });
      res.send(connectionResponse.createResponse("200","Posts",postArray));
    } 
  })
  .catch((error)=>{
    res.send(connectionResponse.createError("500","Server error"));
  })
});

router.get('/getPostsByUser/:username', (req, res)=> {
  var neo4jClient = require('../src/Neo4JConnection');
  const session = neo4jClient.driver.session();
  session.run(postQueries.matchPostByUser,{username:req.params.username})
  .then((result)=>{
    if((result.records.length)==0){
      session.close()
      res.send(connectionResponse.createError('400','User has no posts'));
    }
    else{
      var postArray=[];
      result.records.forEach(record=>postArray.push({ ...record.get('post').properties }));
      postArray.forEach((singlePost,index,array)=>{
        let newSession = neo4jClient.driver.session();
        newSession.run(postQueries.getNumOfLikes, {title:singlePost.title})
        .then(numOfLikesResult=>{
          postArray[index].numOfLikes = numOfLikesResult.records[0].get('numOfLikes').low;
          singlePost.numOfLikes = numOfLikesResult.records[0].get('numOfLikes').low;
          redisConnection.createConnection().then(client=>{
            const cacheId = 'post:'+singlePost.title;
            client.hmset([cacheId,
              "title",singlePost.title,
              "description",singlePost.description,
              "createdAt",singlePost.createdAt,
              "numOfLikes",singlePost.numOfLikes],(error,result)=>{
                if(error){
                  console.log(error);
                  client.quit();
                }
                else if(result !=null ){
                  client.expire(cacheId,300);
                  client.quit();
                }
            })
          })
          if(index === array.length-1){
            console.log(postArray);
            res.send(connectionResponse.createResponse("200","Posts",postArray));
          }
          newSession.close();
        })
      });
      session.close();
    }
  })
  .catch((error)=>{
    console.log(error);
    session.close();
    res.send(connectionResponse.createError("500","Server error"));
  })
});

router.get('/getPost/:title', (req, res)=> {
  redisConnection.createConnection().then((client)=>{
    cacheId = 'post:'+req.params.title;
    client.hgetall(cacheId,(err,results)=>{
      if (results===null) {
        var neo4jClient = require('../src/Neo4JConnection');
        const session = neo4jClient.driver.session();
        session.run(postQueries.matchPostByTitle,{title:req.params.title})
        .then((result)=>{
          if((result.records.length)==0){
            res.send(connectionResponse.createError("404","No post found"));
            session.close();
          }
          else{
            var myPost=result.records[0].get('post').properties;
            session.run(postQueries.getNumOfLikes,{title:req.params.title})
            .then((result)=>{
              myPost.numOfLikes = result.records[0].get('numOfLikes').low;
              redisConnection.createConnection().then((client)=>{
                client.hmset([cacheId,
                  "title",myPost.title,
                  "description",myPost.description,
                  "createdAt",myPost.createdAt,
                  "numOfLikes",myPost.numOfLikes],(err,result)=>{
                  if(err){
                    client.quit();
                    console.log(err)
                  }
                  else{
                    client.quit();
                    client.expire(cacheId,300);
                  }
                })});
              session.close();
              res.send(connectionResponse.createResponse("200","Post found",myPost));
            })
            .catch(error=>{console.log(error);})
          }})
        .catch((error)=>{
            res.send(connectionResponse.createResponse("500","Server error"));
        })   
      } else 
      res.send(connectionResponse.createResponse("200","Post found",results));
    })
  });
});

router.get('/getPostsOfType/:type',(req,res)=>{
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    
    session.run(postQueries.matchPostByType,{nameOfType:req.params.type}).then((result)=>{
        let posts = [];
        result.records.forEach((singleRecord)=>{posts.push(getPostFromRecord(singleRecord));});
        //KESIRANJE NECEGA
        session.close();
        res.send(connectionResponse.createResponse("200","Post found",posts));
    })
});

router.get('/getTypesOfPost/:title',(req,res)=>{
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    
    session.run(postQueries.matchTypesByPost,{postTitle:req.params.title}).then((result)=>{
        let types = [];
        result.records.forEach((singleRecord)=>{types.push(getTypeFromRecord(singleRecord));});
        redisConnection.createConnection().then(client=>{
          types.forEach(singleType=>{
            client.rpush("type:"+req.params.title,singleType.type);
          })
          client.expire("type:"+req.params.title,500);
        })
        session.close();
        res.send(connectionResponse.createResponse("200","Types found",types));
    })
});

router.get('/getTopLiked/:topN',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  session.run(postQueries.matchMostLikedPosts,{
    topN:parseInt(req.params.topN)
  })
  .then(result=>{
    if(result.records.length === 0)
      {
        console.log(result.records)
        res.send(connectionResponse.createError("404","No posts found"));
      }
    else
      res.send(connectionResponse.createResponse("200","Top list",getTopList(result.records)));
    session.close();
  })
  .catch(error=>{
    res.send(connectionResponse.createError("500","Server error"))
    session.close();
  })
})

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

function getTopList(records){
  let array = [];
  records.forEach((record)=>{
    array.push({
      post:record.get('post').properties,
      numOfLikes:record.get('numberOfLikes')
    });
  })
  return array;
}

module.exports=router;