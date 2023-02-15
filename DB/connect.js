const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const connect = (url) =>{
    return mongoose.connect(url)
}
module.exports = connect