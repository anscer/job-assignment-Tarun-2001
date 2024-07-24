const { StatusCodes } = require("http-status-codes")
const { errorObject } = require("../helper/errorObject")
const CustomError = require("../errors/customError")


const BAD_REQUEST = StatusCodes.BAD_REQUEST
const INTERNAL_SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR
const UNAUTHORIZED = StatusCodes.UNAUTHORIZED



const errorHandle = (err,req,res,next)=>{
 
    if(err instanceof CustomError){
        return res.status(err.statusCode).json(errorObject(err.statusCode,err.message,err))
    }
    if(err.name==='ValidationError'){
        return res.status(BAD_REQUEST).json(errorObject(BAD_REQUEST,"Please fill all required fields!!",err))
    }
    if(err.name==='JsonWebTokenError'){
        return res.status(UNAUTHORIZED).json(errorObject(UNAUTHORIZED,"Please provide proper Bearer Token",err))
    }
    if(err.errorResponse?.code===11000){
        const errMsg = `Duplicate key error!! These entities are already present: ${Object.entries(err.keyValue).map(([key, value])=> `${key}: ${value}`).join(', ')}`
        return res.status(BAD_REQUEST).json(errorObject(BAD_REQUEST,errMsg,err))
    }
        
    return res.status(500).json(errorObject(INTERNAL_SERVER_ERROR,'Oops!!! Something Went Wrong....',err))
}
module.exports = {errorHandle}