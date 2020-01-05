var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const NeoClient = require('../src/Neo4JConnection');
    const session = NeoClient.driver.session();
    session.run('MATCH (post:Post),(comm:Comment) RETURN post,comm').then((result)=>{
        res.send(result);
        session.close();
    })
});

router.post('/likePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  let datum=new Date().toLocaleDateString('en-GB',{timeZone:'UTC'});
  let queryString="MATCH (user:User), (post:Post) WHERE ID(user)=$userId AND ID(post)=$postId "
                + "MERGE (user)-[l:Likes]->(post) "
                + "ON CREATE SET l.date=$date";
  session.run(queryString,{
    userId:parseInt(req.body.userId),
    postId:parseInt(req.body.postId),
    date:datum
  })
    .then((result)=>{
        res.send({queryResult:true});
        session.close();
    })
    .catch(error=>{
        res.send({queryResult:false});
        session.close();
    });
});

router.post('/unlikePost',(req,res)=>{
  const NeoClient=require('../src/Neo4JConnection');
  const session = NeoClient.driver.session();
  let queryString = "MATCH (user:User),(post:Post) WHERE ID(user)=$userId AND ID(post)=$postId "
                  + "OPTIONAL MATCH (user)-[l:Likes]-(post) DELETE l"
  session.run(queryString,{
    userId:parseInt(req.body.userId),
    postId:parseInt(req.body.postId)
  })
    .then((result)=>{
        res.send({queryResult:true});
        session.close();
    })
    .catch(error=>{
        res.send(NeoClient.session);
        res.send({queryResult:false});
        session.close();
    });
});


module.exports = router;
