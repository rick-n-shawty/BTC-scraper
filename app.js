require('dotenv').config()
require('express-async-error')

const express = require('express')
const app = express()

const connect = require('./DB/connect')
const port = process.env.PORT || 5000
const router = require('./routes/routes')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const NotFound = require('./middleware/NotFound')
const {handleError} = require('./middleware/ErrorHandler')

app.use(cors({
    origin: '*'
}))
app.use(xss())
app.use(helmet())
app.use(express.json())
app.use('/api/v1', router)
app.use(handleError)
app.use(NotFound)



const start = async () =>{
    try{
        await connect(process.env.MONGO_URI);
        app.listen(port, ()=> console.log(`server is up on port ${port}...`));
    }catch(err){
        console.log(err);
    }
}
start()