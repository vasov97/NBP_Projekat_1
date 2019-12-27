var express = require('express');
const redisConnection = require('../src/RedisConnection.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getUser/:userId',(req,res,next)=>{
  console.log(req.params.userId);
  redisConnection.createConnection().then( client=>{ client.hgetall(req.params.userId.toString(),(err,obj)=>{
    res.send(obj);
  }) });
  //res.send(redisConnection.createConnection().then(client=>{ return  client.hgetall(req.params.userId.toString()) }));
});

module.exports = router;
