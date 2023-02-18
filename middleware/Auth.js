const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')
const {UNAUTHORIZED} = require('../middleware/Error')
const Auth = (req,res,next) =>{
    const authHead = req.headers.authorization 
    const token = authHead.split(' ')[1]
    if(!token) throw new UNAUTHORIZED('no token present')
    jwt.verify(token, process.env.JWT, (err, data) =>{
        if(err) throw new UNAUTHORIZED('token is expired please log in again')
        req.userId = data.userId
        next()
    })
}
module.exports = Auth