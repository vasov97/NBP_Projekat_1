var neo4j = require('neo4j-driver');
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','nbpnbp'));
var session = driver.session();


function createError(message){
    let responseMessage = message
    if (responseMessage === undefined)
        responseMessage = "ERROR";
    return error =  {
        message : responseMessage,
        status : 400
    };
}

function createResponse(message, optionalObject){
    let responseMessage = message
    if (responseMessage === undefined)
        responseMessage = "OK";
    return response =  {
        message : responseMessage,
        object : optionalObject,
        status : 200
      }
}

module.exports = {driver:driver,session:session,createError,createResponse};
