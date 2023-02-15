const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true],
        unique: true,
        match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
    'please provide valid email'
    ]
    },
    password: {
        type: String,
        required: [true, 'password must be prowided'],
        minLength: 6
    },
    isConfirmed: {
        default: false,
        type: Boolean
    },
    isTrackingActive: {
        default: false,
        type: Boolean
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.Compare = async function(password){
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}
const User = mongoose.model('users',  UserSchema)

module.exports = User