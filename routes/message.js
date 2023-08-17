const {sendMessage,allMessages} = require('../controllers/message')
const express = require('express')
const router = express.Router();
const {verifyToken} = require('../middleware/auth')

router.post('/sendMessage',verifyToken,sendMessage)
router.get('/allMessages',verifyToken,allMessages)

module.exports = router