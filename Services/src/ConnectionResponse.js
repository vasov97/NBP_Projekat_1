function createError(status, message){
    let responseMessage = message;
    if (responseMessage === undefined)
        responseMessage = "ERROR";
    let responseStatus = status;
    if(responseStatus === undefined)
        responseStatus = "400";
    return error =  {
        message : responseMessage,
        status : parseInt(status)
    };
}

function createResponse(status, message, optionalObject){
    let responseMessage = message
    if (responseMessage === undefined)
        responseMessage = "OK";
    let responseStatus = status;
    if(responseStatus === undefined)
        responseStatus = "400";
    return response =  {
        message : responseMessage,
        object : optionalObject,
        status : parseInt(status)
      }
}

module.exports = {createError,createResponse};