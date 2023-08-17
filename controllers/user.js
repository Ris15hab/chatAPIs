const User = require('../models/user')
const { createError } = require('../middleware/error')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const register = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const user = new User({
            name,
            email,
            password,
        })
        await user.save()
        res.status(201).json({ message: "User succesfully created" })
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const userData = await User.findOne({ email })
        if (userData) {
            const isMatch = await bcrypt.compare(password, userData.password)
            if (isMatch) {
                const token = jwt.sign({ userData }, process.env.SECRET_KEY)
                res.status(200).json({ userData, token })
            } else {
                return next(createError(400, "Invalid Login Credentials"))
            }
        } else {
            return next(createError(400, "Invalid Login Credentials"))
        }
    } catch (err) {
        next(err)
    }
}

const getUsers = async (req, res, next) => {
    try {
        const _id = req.user.userData._id
        const users = await User.find({
            $or: [
                { name: { $regex: req.query.search, $options: "i" } }, //mongo regex 
                { email: { $regex: req.query.search, $options: "i" } },
            ]
        }).find({ _id: { $ne: _id } });
        res.status(200).json({ users });
    } catch (err) {
        next(err)
    }
};

module.exports = {
    register,
    login,
    getUsers
}