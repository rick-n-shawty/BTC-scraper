const {StatusCodes} = require('http-status-codes')
const {CustomError} = require('../middleware/Error')
const handleError = (err, req, res, next) =>{
    let tempError = {
        statusCode: err.statusCode || err.code 
    }
    if(err instanceof CustomError){
        return res.status(err.statusCode).json({err: err.message})
    }else if(tempError.statusCode === 11000){
        return res.status(StatusCodes.BAD_REQUEST).json({err: 'sorry, user with this email already exists'})
    }else if(err.errors.password){
        return res.status(StatusCodes.BAD_REQUEST).json({err: 'password must be at least six charachters'})
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: err})
}
module.exports = {handleError}