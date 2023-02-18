const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../DB/User');
const { StatusCodes } = require('http-status-codes');
const {BAD_REQUEST, UNAUTHORIZED, NOT_FOUND} = require('../middleware/Error');
const Login = async (req, res, next) =>{
    try{
        const {email, password} = req.body
        if(!email || !password) throw new BAD_REQUEST('please provide all credentials')
        const user = await User.findOne({email})
        if(!user) throw new NOT_FOUND('user not found')
        if(!user.isConfirmed) throw new UNAUTHORIZED('please verify your email first')
        const isMatch = await user.Compare(password)
        if(!isMatch) throw new BAD_REQUEST('wrong password')
        const accessToken = jwt.sign({userId: user._id}, process.env.JWT, {expiresIn: process.env.JWT_LIFETIME})
    
        res.status(200).json({msg: 'here u go', accessToken})
    }catch(err){
        return next(err)
    }
}
const Register = async (req, res, next) =>{
    const {email, password} = req.body
    try{
        if(!email || !password) throw new BAD_REQUEST('please provide all credentials')
        const user = await User.create({email, password})
        const token = jwt.sign({userId: user._id},  process.env.JWT)
        const url = `https://btc-scraper-auth.onrender.com/api/v1/confirmation/${token}`
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const msg = {
            to: email,
            subject: 'Confirm Email',
            text: `click on this link ${url}`
        }
        transport.sendMail(msg, (err, data)=>{
            if(err){
                console.log(err)
            }
            console.log(data)
        })
        return res.status(200).json({msg: 'almost there, verify your email please'})
    }catch(err){
        next(err)
    }
}
const Confirm = async (req, res) =>{
    const {token} = req.params
    if(!token) return res.status(StatusCodes.BAD_REQUEST).send('oops, something went wrong')
    jwt.verify(token, process.env.JWT, async (err, decoded)=>{
        if(err){
            return res.status(StatusCodes.UNAUTHORIZED).send('oops, somthing went wrong')
        }
        console.log(decoded)
        await User.findByIdAndUpdate(decoded.userId, {isConfirmed: true})
        return res.status(200).send(`Email Verified, please procced to <a href = 'http://localhost:3000/login'>Login page</a>`)
    })
}
const StartTrack = async (req, res, next) =>{ 
    const {userId} = req
    try{
        const user = await User.findByIdAndUpdate(userId, {isTrackingActive: true}, {new: true})
        if(!user) throw new NOT_FOUND('user not found')
        res.status(StatusCodes.OK).json({msg: 'we will send you emails', status: user.isTrackingActive})
    }catch(err){
        console.log(err)
        next(err)
    }
}
const StopTrack = async (req, res, next) =>{
    const {userId} = req
    try{
        const user = await User.findByIdAndUpdate(userId, {isTrackingActive: false}, {new: true})
        if(!user) throw new NOT_FOUND('user not found')
        res.status(StatusCodes.OK).json({msg: 'we will not send you emails anymore', status: user.isTrackingActive})
    }catch(err){
        console.log(err)
        next(err)
    }
}
const getUser = async (req, res, next) =>{
    const {userId} = req
    try{
        const user = await User.findById(userId)
        if(!user) throw new NOT_FOUND('user not found')
        res.status(StatusCodes.OK).json({msg: 'here u go', user: {
            email: user.email,
            isTrackingActive: user.isTrackingActive
        }})
    }catch(err){
        console.log(err)
        next(err)
    }
}

module.exports = {
    Confirm,
    Register,
    Login,
    StartTrack,
    StopTrack,
    getUser
}