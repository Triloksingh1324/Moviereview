import mongoose,{Schema} from "mongoose";

const reviewLikeSchema=new Schema({
    reviewText: {
        type: String,
        required: true,
    },
    reviewId:{
        type:String,
        required:true
    },
    movieId:{
        type:Number,
        required:true
    },
    movieTitle:{
        type:String,
        // required:true
    },
    username: {
        type: String,
        required: true,
        lowercase:true
    },
})

export const ReviewLike=mongoose.model('ReviewLike',reviewLikeSchema)