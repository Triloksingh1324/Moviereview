import {asyncHanlder} from '../utils/asynchandler.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

import { generateAccessAndRefreshToken } from './user.controllers.js';
import { refreshAccessToken } from './user.controllers.js';
// import 
const options={
    httpOnly:true,
    secure:true,
    sameSite: "none",
}
const authLogin=asyncHanlder(async(req,res)=>{
    let userData=req.body
    console.log("user",userData)
    const user=await User.findOne({
        email:userData.email
    })
    console.log("helo")
    
    if(user){
        user.isVerified=true;
    await user.save({validateBeforeSave:false})
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    if (!accessToken|| !refreshToken){
        throw new ApiError(500,"Failed to generate Tokens")
    }
    const loggedIn=await User.findById(user._id).select("-password -refreshToken")
    
         return res
         .status(200)
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",refreshToken,options)
         .json(
            new ApiResponse(
                200,
                {
                    user:accessToken,refreshToken,loggedIn
                },
                "User Login Successfully"
            )
         )
    }
    else{
        user = await User.create({
            username: userData.name || userData.email.split('@')[0], // Default username if not provided
            email:userData.email,
            password: "filmflix", 
            authProvider: true,
            isVerified:true,
            profileImage:userData.picture,

          });
          if(!user){
            throw new ApiError("Error while creating user")
          }
console.log("user",user)
          const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    if (!accessToken|| !refreshToken){
        throw new ApiError(500,"Failed to generate Tokens")
    }
    const loggedIn=await User.findById(user._id).select("-password -refreshToken")
    
         return res
         .status(200)
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",refreshToken,options)
         .json(
            new ApiResponse(
                200,
                {
                    user:accessToken,refreshToken,loggedIn
                },
                "User Login Successfully"
            )
         )
    }
})

const setPassword=asyncHanlder(async(req,res)=>{
    const {password}=req.body;
    console.log("password",password
    )
    const user= await User.findById(req.user._id)
    if(!user){
        throw new ApiError(401,"User not found")
    }
    user.password=password
    user.authProvider=false
    await user.save({validateBeforeSave:true})

    return res
    .status(200)
    .json(
        new ApiResponse(200,"Password Set Successfuly")
    )
})
export {authLogin,options,setPassword}