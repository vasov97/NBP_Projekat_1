const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send("This is path for Comments in Neo4J");
});

router.post('/getPostComments',(req,res)=>{
    var postId = req.body.postId;
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();

    session.run("MATCH (comm:Comment)-[:PostKomentara]->(post:Post {id:$id}) return comm",{id:parseInt(postId)})
    .then((result)=>{
        let comments = [];
        result.records.forEach((singleRecord)=>{comments.push(getCommentFromRecord(singleRecord));});
        session.close();
        res.send(comments);
    })
});

router.post('/createComment',(req,res)=>{
    const NeoClient=require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    let queryString="MATCH (user:User),(post:Post) WHERE ID(user)=$userId AND ID(post)=$postId "
        +"CREATE (user)-[:Comments]->(comm:Comment{text:$text})-[:PostKomentara]->(post)";
    session.run(queryString,{
        userId:parseInt(req.body.userId),
        postId:parseInt(req.body.postId),
        text:req.body.text})
    .then((result)=>{
        res.send({queryResult:true});
        session.close();
    })
    .catch(error=>{
        res.send({queryResult:false});
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
        text:driverRecord._fields[0].properties.text
    }
    return myPost;
}

module.exports=router;