const {register,login,getUsers} = require('../controllers/user')
const express = require('express')
const router = express.Router();
const {verifyToken} = require('../middleware/auth')

router.post('/register',register)
router.post('/login',login)
router.get('/getUsers',verifyToken,getUsers)

module.exports = router