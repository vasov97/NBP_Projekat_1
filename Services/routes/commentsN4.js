const express = require('express');
const redisConnection = require('../src/RedisConnection.js');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send("This is path for Comments in Neo4J");
});

router.post('/getPostComments',(req,res)=>{

    redisConnection.createConnection().then(client=>{
        client.hgetall('comment:'+req.body.title,(err,result)=>{
            if(result===null){
                const queryString="MATCH (user)-[:Comments]->(comm:Comment)-[:IsCommentOf]->(post:Post {title:$title}) RETURN comm,user.username";
                const NeoClient = require('../src/Neo4JConnection');
                const session = NeoClient.driver.session();
                session.run(queryString,{title:req.body.title})
                .then((result)=>{
                    let comments = [];
                    result.records.forEach((singleRecord)=>{comments.push(getCommentFromRecord(singleRecord));});
                    session.close();
                    var array=getArray(req.body.title,comments)
                    redisConnection.createConnection().then(client=>{
                        client.hmset(array);
                        comments.forEach(comment=>{
                        
                            client.set('comment:'+comment.id,comment.text)
                        })
                    })
                    res.send(NeoClient.createResponse('Comments',comments));
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
                                res.send(data);
                        })
                    });
                });
            }
        })
    })
});

router.post('/createComment',(req,res)=>{
    const NeoClient=require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    let queryString="MATCH (user:User),(post:Post) WHERE user.username=$username AND post.title=$title "
        +"CREATE (user)-[:Comments]->(comm:Comment{text:$text})-[:IsCommentOf]->(post)";
    session.run(queryString,{
        username:req.body.username,
        title:req.body.title,
        text:req.body.text})
    .then((result)=>{
        res.send(NeoClient.createResponse("Comment created"));
        session.close();
    })
    .catch(error=>{
        res.send(NeoClient.createError(error.message));
        session.close();
    });
    
});

router.post('/deleteComment',(req,res)=>{
    const NeoClient=require('../src/Neo4JConnection');
    const session = NeoClient.driver.openSession();
    let queryString="MATCH (comm:Comment) WHERE ID(comm)=$commId DETACH DELETE comm";
    session.run(queryString,{commId:parseInt(req.body.commId)})
    .then((result)=>{
        res.send({queryResult:true});
        session.close();
    })
    .catch(error=>{
        res.send({queryResult:false});
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