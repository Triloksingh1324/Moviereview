import {asyncHanlder} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
const verifyJWT=asyncHanlder(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.
        header("Authorization")?.replace("Bearer "," ")
    
        if(!token){
            throw new ApiError(401,"Unthorized Acess")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken){
            throw new ApiError(401,"Invalid Token Access")
        }
    
        const user=await User.findById(decodedToken?._id).select
        ("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid User Access")
        }
        // console.log("User found:", user);
        req.user=user
        // console.log("VALIDATE",req.user)
        next()
    } catch (error) {
        throw new ApiError(400,error?.message||"Token not find")
    }
})

export default verifyJWT