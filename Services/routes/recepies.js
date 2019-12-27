var express = require('express');
const redisConnection = require('../src/RedisConnection.js');
var router = express.Router();


/* GET recepies listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getRecepie/:recepieId',(req,res)=>{
    redisConnection.createConnection().then((client)=>{
        res.send(client.hget(req.params.recepieId));
    })
});

module.exports = router;
