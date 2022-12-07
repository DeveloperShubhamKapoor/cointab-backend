
const express = require("express")
const UserModel = require("../model/user.model")
const loginRouter = express.Router()
require('dotenv').config()
const jwt = require("jsonwebtoken")


loginRouter.post("/",async(req,res)=>{
    const {email,password} = req.body
    const isPresent = await UserModel.findOne({email:email})
    if(!isPresent){
        return res.send({message:"User is not registered try signing in",loggedIn:false,token:null})
    }
    if(password == isPresent.password){
        if(isPresent.wrongAttempts>4){
            let now = Date.now()

            if(Number(now)>Number(isPresent.nextTry)){
                await  UserModel.findOneAndUpdate({email:email},{wrongAttempts:0,nextTry:""},{returnNewDocument:true})
                const token = jwt.sign({email:email},process.env.SECRET_KEY)
                return res.send({message:"User logged in successfully",token:token,loggedIn:true,email:email})
            }
            else{
                return res.send({message:"User is blocked try after 24 hours",token:null,loggedIn:false})
            }
        }
        await UserModel.findOneAndUpdate({email:email},{wrongAttempts:0,nextTry:""},{returnNewDocument:true})
        const token = jwt.sign({email:email},process.env.SECRET_KEY)
        return res.send({message:"User logged in successfully",token:token,loggedIn:true,email:email})
    }

    if(password!= isPresent.password){
        if(isPresent.wrongAttempts<4){
            const user = await UserModel.findOneAndUpdate({email:email},{wrongAttempts:isPresent.wrongAttempts+1},{returnNewDocument:true})
            console.log(user)
            //await user.save()
            return res.send({message:"Wrong Password try again",loggedIn:false,token:null})
        }
        if(isPresent.wrongAttempts  == 4){
            let lastAttemptTime =  new Date()
            let blockTime = lastAttemptTime.setHours(lastAttemptTime.getHours()+24);
            await UserModel.findOneAndUpdate({email:email},{wrongAttempts:isPresent.wrongAttempts+1,nextTry:blockTime},{returnNewDocument:true})
            return res.send({message:"Last attempt failed try after 24 hours",loggedIn:false,token:null})
        }
        return res.send({message:"User blocked try after 24 hours",loggedIn:false,token:null})
    }

})









module.exports = loginRouter