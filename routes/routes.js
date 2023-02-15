const express = require('express')
const router = express.Router()
const {Login, Register, Confirm, StartTrack, StopTrack, getUser} = require('../controllers/controllers')
const Auth = require('../middleware/Auth')

router.post('/login', Login)
router.post('/register', Register)
router.get('/confirmation/:token', Confirm)
router.post('/start_track', Auth, StartTrack)
router.post("/stop_track", Auth, StopTrack)
router.get('/user', Auth, getUser)
module.exports = router