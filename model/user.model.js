const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    wrongAttempts:{type:Number,required:true,default:0},
    nextTry:{type:String,default:""}
})

const UserModel = new mongoose.model("user",userSchema)

module.exports = UserModel