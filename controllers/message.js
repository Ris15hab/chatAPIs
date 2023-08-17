const Message = require('../models/message')
const Chat = require('../models/chat')
const {createError} = require('../middleware/error')

const sendMessage = async (req, res, next) => {
    try{
        const {content, chatID} = req.body;
        const message = new Message({
            sender:req.user.userData._id,
            content,
            chat:chatID
        })
        await message.save();

        const chat = await Chat.updateOne({_id:chatID},{
            $set:{
                latestMessage:message._id
            }
        })

        res.status(200).json({message:"message saved to db"})
    }catch(err){
        next(err)
    }
}

const allMessages = async(req,res,next)=>{
    try{
        const {_id} = req.query;
        const allMessages = await Message.find({chat:_id}).populate('sender').populate('chat')
        res.status(200).json({allMessages})
    }catch(err){
        next(err)
    }
}

module.exports = {
    sendMessage,
    allMessages
}