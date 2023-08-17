const Chat = require('../models/chat')
const User = require('../models/user')
const Message = require('../models/message')
const { createError } = require('../middleware/error')

const createOneToOne = async (req, res, next) => {
    try {
        const { userID } = req.body;
        var chatData = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: userID },
                { users: req.user.userData._id },
            ],
        }).populate('users')
        // .populate('latestmessage')

        //populating sending feild in latest message too.
        // chatData = await User.populate(chatData, {
        //     path: "latestMessage.sender",
        //     select: "name email",
        // });

        for (let index = 0; index < chatData.length; index++) {
            if (chatData[index].latestMessage) {
                chatData[index] = await Message.populate(chatData[index], {
                    path: "latestMessage"
                });
                chatData[index] = await User.populate(chatData[index], {
                    path: "latestMessage.sender"
                });
            }
        }

        if (chatData.length != 0) {
            res.status(200).json({ chatData })
        } else {
            const userDetails = await User.findOne({ _id: userID })
            const newChat = new Chat({
                chatName: userDetails.name,
                isGroupChat: false,
                users: [req.user.userData._id, userID],
            })
            await newChat.save();
            const FullChat = await Chat.findOne({ _id: newChat._id }).populate("users");
            res.status(200).json({ FullChat });
        }
    } catch (err) {
        next(err)
    }
}

const allChats = async (req, res, next) => {
    try {
        var chatData = await Chat.find({
            users: req.user.userData._id
        }).populate('users')
        // const latestMsgCheck = await Message.findOne({_id:chatData.late})
        for (let index = 0; index < chatData.length; index++) {
            if (chatData[index].latestMessage) {
                chatData[index] = await Message.populate(chatData[index], {
                    path: "latestMessage"
                });
                chatData[index] = await User.populate(chatData[index], {
                    path: "latestMessage.sender"
                });
            }
            if (chatData[index].isGroupChat) {
                chatData[index] = await User.populate(chatData[index], {
                    path: "groupAdmin"
                });
            }
        }
        res.status(200).json({ chatData })
    } catch (err) {
        next(err)
    }
}

const createGroup = async (req, res, next) => {
    try {
        const { chatName, users } = req.body;
        users.push(req.user.userData._id)
        if (users.length <= 2) {
            return next(createError(400, "Group chat must contain more than 2 members"))
        }
        const chat = new Chat({
            chatName,
            isGroupChat: true,
            users,
            groupAdmin: req.user.userData._id
        })
        await chat.save();

        const chatData = await Chat.findOne({ _id: chat._id }).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).json({ chatData });
    } catch (err) {
        next(err)
    }
}

const renameGroup = async (req, res, next) => {
    try {
        const { _id, chatName } = req.body
        const chat = await Chat.updateOne({ _id }, {
            $set: {
                chatName
            }
        })
        res.status(200).json({ message: "Group renamed successfully!" });
    } catch (err) {
        next(err)
    }
}

const addToGroup = async (req, res, next) => {
    try{
        const{chatID,userID} = req.body;
        const chatData = await Chat.updateOne({_id:chatID},{
            $push:{
                users:userID
            }
        })
        res.status(200).json({message:"Added to Group"})
    }catch(err){
        next(err)
    }
}

const removeFromGroup = async (req, res, next) => {
    try{
        const{chatID,userID} = req.body;
        const chatData = await Chat.updateOne({_id:chatID},{
            $pull:{
                users:userID
            }
        })
        res.status(200).json({message:"Removed from Group"})
    }catch(err){
        next(err)
    }
}

module.exports = {
    createOneToOne,
    allChats,
    createGroup,
    renameGroup,
    addToGroup,
    removeFromGroup
}