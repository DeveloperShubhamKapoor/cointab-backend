const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()
const app = express()
const signupRouter = require("./routes/signup.route")
const loginRouter = require("./routes/login.route")
const port = process.env.PORT|| 5500

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Welcome to cointab")
})
app.use("/usersignup",signupRouter)
app.use("/userlogin",loginRouter)





app.listen(port,async()=>{
    await mongoose.connect(process.env.SERVER)
    console.log(`server started`)
})