import { asyncHanlder } from '../utils/asynchandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ReviewLike } from '../models/ReviewLike.model.js';

const reviewLike=asyncHanlder(async(req,res)=>{
    const {movieId,movieTitle,reviewId,reviewText}=req.body
    const name=req.user.username
    // console.log("req.body",req.body)
    const user=await ReviewLike.findOne({reviewId:reviewId,username:name})
    if (!user){
    //    console.log("if here")
        const likedData=await ReviewLike.create({
            username:name.toLowerCase(),
            movieId,
            movieTitle,
            reviewId,
            reviewText
        })

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedData,
                "Reply likes successfully"
            )
        )
    }
    else{
        // console.log("else")
        const likedRemove=await ReviewLike.deleteOne({reviewId:reviewId,username:name})
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedRemove,
                "Reply like Removed"
            )
        )
    }
})

const reviewIsLiked=asyncHanlder(async(req,res)=>{
    const { reviewId } = req.params;
    // console.log("id is",reviewId)
    const name = req.user.username;
// console.log("lok")
    const liked = await ReviewLike.findOne({ reviewId, username:name});
    if (liked) {
        return res.status(200).json({ liked: true });
    } else {
        return res.status(200).json({ liked: false });
    }
})

const reviewLikeCount=asyncHanlder(async(req,res)=>{
    const { reviewId } = req.params;
    const movie=await ReviewLike.findOne({reviewId:reviewId})
    let movieDetails = null; 
    // if (movie){
    //     console.log("helo")
    // }
    if(movie){
        movieDetails=await ReviewLike.aggregate([
            {
                $match:{
                    reviewId:reviewId
                }
            },
            {
                $lookup:{
                    from:"reviewlikes",
                    localField:"reviewId",
                    foreignField:"reviewId",
                    as:"likedBy"
                }
            },
          
            {
                $addFields:{
                    replyLikedCount:{
                        $size:"$likedBy"
                    },
                    
                },
                
            },
            {
            $project:{
                likedBy:1,
                replyLikedCount:1,
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
            "Review Likes Details Fetched Successfully"
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
                "Review with zero likes"
            )
        )
    }
})

export {reviewLike,reviewIsLiked,reviewLikeCount}