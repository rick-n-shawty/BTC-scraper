require('dotenv').config()
const express = require('express')
const app = express()
const puppeteer = require('puppeteer')
let interval = undefined
const prevPrice = []
const nodemailer = require('nodemailer')
const connect = require('./DB/connect')
const User = require('./DB/User')
const port = process.env.PORT || 5000
const router = require('./routes/routes')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
app.use(cors({
    origin: '*'
}))
app.use(xss())
app.use(helmet())
app.use(express.json())
app.use('/api/v1', router)


async function FETCH(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const source = await page.goto(process.env.SOURCE, {timeout: 60000, waitUntil: 'load'})
    const status = source.status()
    console.log("Status", status)
    await page.waitForSelector('[data-test="instrument-price-last"]', {timeout: 0})
    await page.setDefaultNavigationTimeout(0); 
    let price = await page.evaluate(()=>{
        return document.querySelector('[data-test="instrument-price-last"]').textContent.replace(/[,]/g, "");
    })
    price = Number.parseInt(price)
    if(prevPrice[0] - price >= 1) {
        const users = await User.find({isTrackingActive: true})
        console.log('price went down')
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        users.map(user =>{
            transport.sendMail({
                to: user.email,
                subject: 'BTC PRICE DECLINED',
                text: `BTC Price went down from ${prevPrice[0]} to ${price}`
            })
        })
    }
    prevPrice.push(price)
    browser.close();
}

const start = async () =>{
    try{
        await connect(process.env.MONGO_URI);
        interval = setInterval(FETCH, 10000)
        app.listen(port, ()=> console.log(`server is up on port ${port}...`));
    }catch(err){
        console.log(err);
    }
}
start()