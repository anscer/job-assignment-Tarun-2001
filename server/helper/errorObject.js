const errorObject = (statusCode,message,error,timestamp)=>{
    return {
        status:statusCode,
        errorMessage:message,
        error,
        path:error.stack
    }
}

module.exports = {errorObject}