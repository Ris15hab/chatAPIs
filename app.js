//importing modules
const express = require('express')
require('dotenv').config();
require('./connection');

const app = express();

app.use(express.json());

//import routes
const userRoute = require('./routes/user')
const chatRoute = require('./routes/chat')
const messageRoute = require('./routes/message')

//setting routes
app.use('/user',userRoute)
app.use('/chat',chatRoute)
app.use('/message',messageRoute)

//error handling
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
})

//setting port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})