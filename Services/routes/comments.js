const connectionResponse = require('../src/ConnectionResponse');
const commentsQueries = require('../queries/commentsQueries');
const express = require('express');
const redisConnection = require('../src/RedisConnection.js');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send("Commets path");
});

router.post('/getPostComments',(req,res)=>{

redisConnection.createConnection().then(client=>{
    client.hgetall('comment:'+req.body.title,(err,result)=>{
        if(result===null){
            const NeoClient = require('../src/Neo4JConnection');
            const session = NeoClient.driver.session();
            session.run(commentsQueries.matchAllPostComments,{title:req.body.title})
            .then((result)=>{
                let comments = [];
                result.records.forEach((singleRecord)=>{comments.push(getCommentFromRecord(singleRecord));});
                session.close();
                var array=getArray(req.body.title,comments);
                redisConnection.createConnection().then(client=>{
                    client.hmset(array);
                    client.expire('comment:'+req.body.title,180);
                    comments.forEach(comment=>{
                        client.set('comment:'+comment.id,comment.text);
                        client.expire('comment:'+comment.id,180);
                    })
                })
                console.log(comments);
                res.send(connectionResponse.createResponse("200",'Comments',comments));
            })
        }
        else{
            var data=[];
            client.hgetall('comment:'+req.body.title,(err,allCommentsOfPost)=>{
                Object.keys(allCommentsOfPost).forEach(function(key,index) {
                    var value = allCommentsOfPost[key];
                    var element={
                        id:key,
                        username:value
                    }
                    client.get('comment:'+key,(err,result)=>{
                        element.text = result;
                        data.push(element);
                        if(index== Object.keys(allCommentsOfPost).length-1)
                            res.send(connectionResponse.createResponse("200","Comments",data));
                    })
                });
            });
        }})
    })
});

router.post('/createComment',(req,res)=>{
    const NeoClient=require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    session.run(commentsQueries.createComment,{
        username:req.body.username,
        title:req.body.title,
        text:req.body.text})
    .then((neoResult)=>{
        redisConnection.createConnection().then(client=>{
            cacheId='comment:'+req.body.title;
            client.exists(cacheId,(error, result)=>{
                if(error){
                    console.log("Error in cache");
                    client.quit();
                }
                else if(result){
                    let comment=neoResult.records[0].get("comment");
                    let username = neoResult.records[0].get("user").properties.username;
                    client.hmset([cacheId,comment.identity.low,username]);
                    client.set('comment:'+comment.identity.low,comment.properties.text);
                    client.quit();
                }
            })
        })
        res.send(connectionResponse.createResponse("200","Comment created"));
        session.close();
    })
    .catch(error=>{
        console.log(error)
        res.send(connectionResponse.createError("500","Server error"));
        session.close();
    });
    
});

router.post('/deleteComment',(req,res)=>{
    const NeoClient=require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    session.run(commentsQueries.deleteComment,{ commId:parseInt(req.body.commId) })
    .then((result)=>{
        res.send(connectionResponse.createResponse("200","Comment deleted"));
        session.close();
    })
    .catch(error=>{
        res.send(connectionResponse.createError("500","Server error"));
        session.close();
    });
});

function getCommentFromRecord(driverRecord){
    var myPost = {
        id:driverRecord._fields[0].identity.low,
        text:driverRecord._fields[0].properties.text,
        username:driverRecord._fields[1]
    }
    return myPost;
}

function getArray(title,comments){
    var newArray=[]
    newArray.push('comment:'+title);
    comments.forEach(comment=>{
        newArray.push(comment.id.toString())
        newArray.push(comment.username)
    })

   return newArray;
}

module.exports=router;