const {createOneToOne,allChats,createGroup,renameGroup,addToGroup,removeFromGroup} = require('../controllers/chat')
const express = require('express')
const router = express.Router();
const {verifyToken} = require('../middleware/auth')

router.post('/createOneToOne',verifyToken,createOneToOne)
router.get('/allChats',verifyToken,allChats)
router.post('/createGroup',verifyToken,createGroup)
router.put('/renameGroup',verifyToken,renameGroup)
router.put('/addToGroup',verifyToken,addToGroup)
router.put('/removeFromGroup',verifyToken,removeFromGroup)

module.exports = router