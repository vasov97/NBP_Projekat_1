const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send("This is path for Posts in Neo4J");
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