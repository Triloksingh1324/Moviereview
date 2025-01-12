import { asyncHanlder } from '../utils/asynchandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { sendVerificationCode } from '../middleware/EmailCode.js';
const verificationCode=asyncHanlder(async(req,res)=>{
    const {email,subject}=req.body

    const user=await User.findOne({email:email})
    if(!user){
        throw new ApiError(401,"Update Your Email First")
    }
    const verficationToken= Math.floor(100000 + Math.random() * 900000).toString()
    console.log("em",email)
    await sendVerificationCode(email,verficationToken,subject)
    user.verficationToken=verficationToken
    user.verficationTokenExpiresAt=Date.now() + 24 * 60 * 60 * 1000
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(200,"Verification code sent successfully")
    )
    // console.log()
})

const verifyEmail=asyncHanlder(async(req,res)=>{
    const {email,code}=req.body
    const user=await User.findOne({
        email:email,
        verficationToken:code,
        verficationTokenExpiresAt:{$gt:Date.now()}
    })
    // console.log("ev",email,code)
    if (!user){
        console.log("helo there")
        throw new ApiError(401,"Invalid or expired Code")
        // return res.status(201).json(new ApiResponse(201,"Invalid or Expired Code"))
    }
    else{
        user.isVerified=true;
     user.verficationToken=undefined;
     user.verficationTokenExpiresAt=undefined;

     await user.save({validateBeforeSave:false})

     return res
     .status(200)
     .json(
        new ApiResponse(200,"Email Verified Successfully")
     )
    }
})

const resetPassword=asyncHanlder(async(req,res)=>{
    const {email,password}=req.body
    const user= await User.findOne({email:email})
    if(!user){
        throw new ApiError(401,"Email Incorrect")
    }
    user.password=password
    await user.save({validateBeforeSave:false})
    return res
     .status(200)
     .json(
        new ApiResponse(200,"Password Reset Successfully")
     )
})
export {verificationCode,verifyEmail,resetPassword}