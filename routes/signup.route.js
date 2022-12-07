const express = require("express")
const UserModel = require("../model/user.model")
const signupRouter = express.Router()

signupRouter.post("/",async(req,res)=>{
    const {email,password} = req.body
    const isPresent = await UserModel.findOne({email:email})
    if(isPresent){
        return res.send({message:"User already registered try signing in",signedUp:false})
    }
    const user = UserModel({email:email,password:password})
    await user.save()
    return res.send({message:"User registered successfully",signedUp:true})
})

module.exports = signupRouter