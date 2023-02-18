const {StatusCodes} = require('http-status-codes')
class CustomError extends Error{
    constructor(message){
        super(message)
    }
}

class BAD_REQUEST extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}
class NOT_FOUND extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}
class UNAUTHORIZED extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}
module.exports = {
    CustomError,
    NOT_FOUND,
    UNAUTHORIZED,
    BAD_REQUEST
}