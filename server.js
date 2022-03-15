// Requirements and dependencies

const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()


// Database Models
const User = require('./models/user')
const Task = require('./models/task')
const Event = require('./models/event')

//backend schema validators
//not implemented yet
const { userSchema, eventSchema, taskSchema } = require('./schemas.js');

// Middleware
const app = express()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


//Connections

//local mongoose connection
mongoose.connect('mongodb://bwerner:uK4iJLMqnv1yElCkpFUU53loTSljAkj4EtAC4YqMtMW2rZXIOaU9Qsb4CxL9lU3WfYFqec953ZBa1mCNWMQncw==@bwerner.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@bwerner@', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//Routes

app.get('/', async(req, res)=>{
    res.send("<h1>Welcome to the Primal Party.</h1>")
})


app.listen(5000, ()=>{
    console.log("listening on port 5000")
})