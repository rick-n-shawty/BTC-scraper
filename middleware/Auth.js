const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')
const Auth = (req,res,next) =>{
    const authHead = req.headers.authorization 
    const token = authHead.split(' ')[1]
    if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({err: 'no token present'})
    jwt.verify(token, process.env.JWT, (err, data) =>{
        if(err) return res.status(StatusCodes.UNAUTHORIZED).json({err: 'token is expired, log in again'})
        req.userId = data.userId
        next()
    })
}
module.exports = Auth