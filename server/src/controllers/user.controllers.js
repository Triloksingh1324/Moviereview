import {asyncHanlder} from '../utils/asynchandler.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Liked } from '../models/Liked.model.js';
import jwt from "jsonwebtoken"
import { Review } from '../models/Review.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import mongoose from 'mongoose';
import { WatchList } from '../models/Watchlist.model.js';
import { Reply } from '../models/Reply.model.js';
import { ReviewLike } from '../models/ReviewLike.model.js';
// import ReviewSection from '../../../client/src/component/reviewSection/ReviewSection.jsx';
const generateAccessAndRefreshToken=async(userId)=>{
    const user=await User.findById(userId)
    if(!user){
        throw new ApiError(401,"User not found")
    }
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
}

const userRegister=asyncHanlder(async(req,res)=>{
    console.log('Request Body:', req.body);
    const {username,email,password}=req.body

    if([username,email,password].some((field)=>field?.trim==""))
        {
            throw new ApiError(400,"All field are required")
        }
    const existedEmail=await User.findOne({
        email:email
    })
    if (existedEmail){
        throw new ApiError(401,"User already Exist")
    }
    const existedUserName=await User.findOne({
        username:username
    })
    if (existedUserName){
        throw new ApiError(401,"Username already occupied")
    }
    const createUser=await User.create({
        username:username.toLowerCase(),
        email,
        password
    })
if(!createUser){
    throw new ApiError("Something wrong while creating account,Please retry after sometime")
}
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,createUser,"User Register Successfully"
        )
    )
})
const options={
    httpOnly:true,
    secure:true,
    sameSite: "none",
}
const loginUser=asyncHanlder(async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({
        email:email
    })
    if(!user){
        throw new ApiError(401,"User not found")

    }
    console.log("error",user)
    const passwordCheck=await user.isPasswordCorrect(password)
    if(!passwordCheck){
        throw new ApiError(401,"Password is wrong")
    }

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
})

const logOutUser=asyncHanlder(async(req,res)=>{
    console.log("helo")
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        } 
    )
    const options={
        httpOnly:true,
        secure:true,
        sameSite: "none",
    }

    return res.
    status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User Logout Successfully")
    )
})

const refreshAccessToken=asyncHanlder(async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookies.refreshToken || 
        req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"Invalid IncomingRefresh Token")
        }
    
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user= await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Unauthorized Token Access")
        }
    
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(400,"Refresh Token Not Matched")
        }
    
        const options={
            httpOnly:true,
            secure:true,
            sameSite: "none",
        }
    
        const{accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,{
                    accessToken,refreshToken:newRefreshToken
                },
                "Access Token Refreshed"
                
            )
        )
    } catch (error) {
        throw new ApiError(400,error?.message||"Invalid Token access")
    }
})
const userReview = asyncHanlder(async (req, res) => {
    const { reviewText, movieId, movieTitle,rating,spoiler } = req.body;
    console.log("review",req.body)
    if (reviewText === "") {
        throw new ApiError("Review should not be empty");
    }
    if (movieId === "") {
        throw new ApiError("movieId missing");
    }
    if (movieTitle === "") {
        throw new ApiError("movie Title missing");
    }
   
    // Find the existing review document for the given movieId
    // const movieReview = await Review.findOne({ movieId });

     
        // If it doesn't exist, create a new document
    const movieReviewCreate = await Review.create({
            movieId,
            movieTitle,
            reviewText,
            rating,
            username: req.user?.username,
            profileImage:req.user?.profileImage,
            spoiler
        });
    
        
    

    return res.status(200).json(
        new ApiResponse(200, {movieReviewCreate}, "Review Submitted Successfully")
    );
});

const getUserDetails=asyncHanlder(async(req,res)=>{
    // console.log("req",req.user)
    // console.log("call")
    if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      else{
        res.status(200)
    .json(
      new ApiResponse(
        200,req.user,"Current User Fetched"
      )
    )
      }
    
  })

const getMovieReviews=asyncHanlder(async(req,res)=>{
    const{movieId}=req.body
    const movie=await Review.findOne({movieId})
    let movieReviewDetails=null
    if (movie){
        movieReviewDetails=await Review.aggregate([
            {
                $match:{
                    movieId:movieId
                }
            },
            {
                $lookup:{
                    from:"reviews",
                    localField:"movieId",
                    foreignField:"movieId",
                    as:"currentMovieReview"
                }
            },
            {
                $lookup:{
                    from:"reviews",
                    localField:"username",
                    foreignField:"username",
                    as:"currentUserReview"
                }
            },
            {
                $addFields:{
                    movieReviewCount:{
                        $size:"$currentMovieReview"
                    },
                    userReviewCount:{
                        $size:"$currentUserReview"
                    }
                }
            },
            {
                $project:{
                    // username:1,
                    // movieId:1,
                    // movieTitle:1,
                    // reviewText:1,
                    currentMovieReview:1,
                    currentUserReview:1,
                    movieReviewCount:1,
                    userReviewCount:1,
                    // profileImage:1
                }
            }
        ])
        if(!movieReviewDetails?.length){
            throw new ApiError("Something wrong in getting movie database")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                movieReviewDetails[0],
                "Send movie details"
            )
        )
    }
    else{
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Send zero review details"
            )
        )
    }
})

const updateUserName=asyncHanlder(async(req,res)=>{
    console.log("rew",req.body)
    const payload=req.body
    console.log("paylo",payload.username)
    const findUser=payload.username
    const user=await User.findOne({findUser})
    console.log("us",user)
    if(user){
        throw new ApiError(401,"This UserName already exist")
     }
    
   
    const setUser=await User.findById(req.user._id)
    const oldUsername=setUser.username;
    setUser.username=payload.username
    await setUser.save({validateBeforeSave:false})
    await Promise.all([
        Reply.updateMany({ username: oldUsername }, { username: payload.username }),
        Review.updateMany({ username: oldUsername }, { username: payload.username }),
        Liked.updateMany({ user_Name: oldUsername }, { user_Name: payload.username }),
        ReviewLike.updateMany({ username: oldUsername }, { username: payload.username }),
        WatchList.updateMany({ username: oldUsername }, { username: payload.username }),
    ]);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            setUser,
            "data update successfully"
        )
    )

})

const updateEmail=asyncHanlder(async(req,res)=>{
    const payload=req.body
    const email=payload.email
    const user=await User.findOne({email})
    if(user){
        throw new ApiError("This Email already exist")
    }
    const setEmail=await User.findById(req.user._id)
    setEmail.email=payload.email
    setEmail.isVerified=false;
    await setEmail.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            setEmail,
            "Email  update successfully"
        )
    )

})

const updatePassword=asyncHanlder(async(req,res)=>{
    const payload=req.body
    const oldPassword=payload.oldPassword
    const newPassword=payload.newPassword
    // console.log("old",oldPassword)
    const user=await User.findById(req.user._id)
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const matchPassword= await user.isPasswordCorrect(oldPassword)
    if(!matchPassword){
        throw new ApiError(401,"old password not correct")
    
      }
    user.password=newPassword
    await user.save({validateBeforeSave:true})
  
    return res
    .status(200)
    .json(
      new ApiResponse(200
        ,{},"Password Change Successfully"
      )
    )
    
 
})

const movieLike=asyncHanlder(async(req,res)=>{
    const {movieId,movieTitle}=req.body
    const name=req.user.username
    // console.log("req.body",req.body)
    const user=await Liked.findOne({movieId:movieId,user_Name:name})
    if (!user){
    //    console.log("if here")
        const likedData=await Liked.create({
            user_Name:name.toLowerCase(),
            movieId,
            movieTitle
        })

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedData,
                "Video likes successfully"
            )
        )
    }
    else{
        // console.log("else")
        const likedRemove=await Liked.deleteOne({movieId:movieId,user_Name:name})
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedRemove,
                "Video like Removed"
            )
        )
    }
})

const movieIsLiked = asyncHanlder(async (req, res) => {
    const { movieId } = req.params;
    const name = req.user.username;
// console.log("lok")
    const liked = await Liked.findOne({ movieId, user_Name:name});
    if (liked) {
        return res.status(200).json({ liked: true });
    } else {
        return res.status(200).json({ liked: false });
    }
});

const watchListCheck=asyncHanlder(async(req,res)=>{
    const { movieId } = req.params;
    const name = req.user.username;
    const movie= await WatchList.findOne({movieId:movieId,username:name})
    if (movie) {
        return res.status(200).json({ movie: true });
    } else {
        return res.status(200).json({ movie: false });
    }
})
const movieLikeCount=asyncHanlder(async(req,res)=>{
    const { movieId } = req.body;
    const movie=await Liked.findOne({movieId:movieId})
    let movieDetails = null; 
    // if (movie){
    //     console.log("helo")
    // }
    if(movie){
        movieDetails=await Liked.aggregate([
            {
                $match:{
                    movieId:movieId
                }
            },
            {
                $lookup:{
                    from:"likes",
                    localField:"movieId",
                    foreignField:"movieId",
                    as:"likedBy"
                }
            },
            {
                $lookup:{
                    from:"likes",
                    localField:"user_Name",
                    foreignField:"user_Name",
                    as:"likedByMeTo"
                }
            },
            {
                $addFields:{
                    likedCount:{
                        $size:"$likedBy"
                    },
                    userLikesCount:{
                        $size:"$likedByMeTo"
                    }
                },
                
            },
            {
            $project:{
                user_Name:1,
                movieId:1,
                movieTitle:1,
                likedBy:1,
                likedByMeTo:1,
                likedCount:1,
                userLikesCount:1,
                // profileImage:1

            }
        }
        ])
        if(!movieDetails?.length){
            throw new ApiError("Movie Details not fetched")
        }
        // console.log("lo",movieDetails)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            movieDetails[0],
            "Movie Likes Details Fetched Sucessfully"
        )
    )
    }
    else{
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Movies with zero likes"
            )
        )
    }
})

const uploadProfileImage=asyncHanlder(async(req,res)=>{
    // console.log("req.files",req.file)
    // console.log("reqbody",req.body)
    const profileImagePath=req.file?.path
    if (!profileImagePath){
        throw new ApiError(401,"Profile Image not found")
    }
    const profileImg=await uploadOnCloudinary(profileImagePath)
    if(!profileImg){
        throw new ApiError(400,"photo not upload")
    }

    const user=await User.findById(req.user._id).select(
        "-password -refreshToken"
    )
    user.profileImage=profileImg.url
    const userFind=req.user.username
    console.log("userfind",userFind)
    const reviewUpdate = await Review.updateMany(
        { username: userFind }, // Match all reviews with the same username
        { $set: { profileImage: profileImg.url } }, // Set the new profileImage
        { multi: true } // Optional, 'multi' updates all matches, but `updateMany` does this by default
    );
    const replyUpdate = await Reply.updateMany(
        { username: userFind }, // Match all reviews with the same username
        { $set: { profileImage: profileImg.url } }, // Set the new profileImage
        { multi: true } // Optional, 'multi' updates all matches, but `updateMany` does this by default
    );

    if (reviewUpdate.nModified > 0 || replyUpdate.nModified > 0) {
        console.log(`Updated ${reviewUpdate.nModified} reviews with new profile image`);
    }

    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Profile Image Upload successfully"
        )
    )
})

const reviewDelete = asyncHanlder(async (req, res) => {
    const { reviewId } = req.body;
    const objectId = new mongoose.Types.ObjectId(reviewId);

    const review = await Review.findById(objectId);
    if (!review) {
        const dlReply=await Reply.findById(objectId)
        if (!dlReply){
            throw new ApiError(401, "Review Not Found");
        }
        await Reply.deleteOne(dlReply)
    }
else{
    await Review.findByIdAndDelete(objectId);
    const reply=await Reply.findOne({parentId:objectId})
     if (reply){
        const filter={parentId:objectId}
        await Reply.deleteMany(filter)
     }
}
    return res.status(200).json(new ApiResponse(200, review, "Review Deleted Successfully"));
});

const reviewEdit=asyncHanlder(async(req,res)=>{
    const {reviewId,reviewText,rating,database}=req.body
// console.log("body",req.body)
if (database=="Review"){
    const review = await Review.findById(reviewId);
    if(!review){
        throw new ApiError(402,"Review Id Not found")

    }

    review.reviewText=reviewText
    review.rating=rating

    await review.save({validateBeforeSave:false})

    return res.
    status(200).
    json(new ApiResponse(
        200,review,"review edit successfully"
    ))
}
else{
    const review = await Reply.findById(reviewId);
    if(!review){
        throw new ApiError(402,"Review Id Not found")

    }

    review.reviewText=reviewText

    await review.save({validateBeforeSave:false})

    return res.
    status(200).
    json(new ApiResponse(
        200,review,"review edit successfully"
    ))
}
    
   
    
})


const watchlist=asyncHanlder(async(req,res)=>{
    const {movieId,movieTitle}=req.body
    const user=req.user.username
    console.log("find",req.body)
    const movie= await WatchList.findOne({movieId:movieId,username:user})
    if (!movie){
        const data=await WatchList.create({
            username:user,
            movieId:movieId,
            movieTitle:movieTitle
        })

        if(!data){
            throw new ApiError(400,"Error while creating watchlist data")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,data,"Added to watchlist successfully"
            )
        )
    }
    else{
        const del=await WatchList.deleteOne({movieId:movieId,username:user})
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,del,"Removed from watchlist"
            )
        )
    }

    
})

const userActivity=asyncHanlder(async(req,res)=>{
    console.log("activity")
    const name=req.user.username
    try {
        const userActivityDetails=await User.aggregate([
            {
                $match: {
                    username: name,
                }
            },
            
            {
                $lookup:{
                    from:"likes",
                    localField: "username",
                    foreignField:"user_Name",
                    as:"userLikes"
                }
            },
            {
                $lookup:{
                    from:"reviews",
                    localField:"username",
                    foreignField:"username",
                    as:"userReviews"
                }
            },
            {
                $lookup:{
                    from:"watchlists",
                    localField:"username",
                    foreignField:"username",
                    as:"userWatchList"
                }
            },
            {
                $addFields:{
                    userReviewCount:{
                        $size:"$userReviews"
                    },
                    userLikesCount:{
                        $size:"$userLikes"
                    },
                    userWatchListCount:{
                        $size:"$userWatchList"
                    }
                }
            },
            {
                $project:{
                    userReviews:1,
                    userLikes:1,
                    userWatchList:1,
                    userReviewCount:1,
                    userLikesCount:1,
                    userWatchListCount:1
                    // profileImage:1
                }
            }
           
        ])
        if (!userActivityDetails || userActivityDetails.length === 0) {
            console.log("here we",userActivityDetails)
            return res.status(404).json({ message: "No user activity found." });
        }
        console.log("down",userActivityDetails)
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userActivityDetails[0],
                "Sent User Activity details"
            )
        )
    } catch (error) {
        console.log("eroor fetching user act",error)
    }
    
    
})

const reviewReply=asyncHanlder(async(req,res)=>{
    const {movieId,movieTitle,reviewId,reviewText}=req.body
    const objectId= new mongoose.Types.ObjectId(reviewId)
    const review = await Review.findById(objectId);
    if(!review){
        throw new ApiError(404,"Review Not Found")
    }
    if([movieId,reviewText].some((field)=>field?.trim=="")){
        throw new ApiError(401,"Field are required")
    }

    const name=req.user.username
    const profile=req.user.profileImage ||null
    // console.log("rev",reviewText)
    const reply=await Reply.create({
        parentId:objectId,
        movieId:movieId,
        username:name,
        reviewText:reviewText,
        movieTitle:movieTitle||null,
        
        profileImage:profile||null

    })

    if(!reply){
        console.log("Something went wrong")
    }

    // console.log("rew",req.body)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,reply,"Reply Submitted"
        )
    )
})

const getMovieReply=asyncHanlder(async(req,res)=>{
    const {movieId}=req.body
    // console.log("req",req.body)
    if (!movieId){
        throw new ApiError(400,"Movie id not get")
    }
    const movie=await Reply.findOne({movieId:movieId})
    if (!movie){
        return res
        .status(200)
        .json(
            new ApiResponse(
                201,"Movie zero reply"
            )
        )
    }
    else{
        const getReply=await Reply.aggregate([
            {
                $match:{
                    movieId:movieId
                }
            },
            {
                $lookup:{
                    from:"replies",
                    localField:"movieId",
                    foreignField:"movieId",
                    as:"movieReplies"
                }
            },
        
            {
                $project:{
                    // movieId:1,
                    // movieTitle:1,
                    movieReplies:1,
                    // username:1,
                    // profileImage:1
                }
            }
        ])
        if (getReply.length==0){
            throw new ApiError(400,"Reply not get")
        }
        return res.
        status(200)
        .json(
            new ApiResponse(
                200,getReply[0],"reply of this movie"
            )
        )
    }
})

export {userRegister,
        loginUser,
        logOutUser,
        generateAccessAndRefreshToken,
        refreshAccessToken,
        userReview,
        getUserDetails,
    getMovieReviews,
     updateUserName,
     updateEmail,
    updatePassword,
movieLike,
movieIsLiked,
movieLikeCount,
uploadProfileImage,
reviewDelete,
reviewEdit,
watchlist,
watchListCheck,
userActivity,
reviewReply,
getMovieReply}
