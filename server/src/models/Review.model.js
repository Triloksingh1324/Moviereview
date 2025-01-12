import mongoose,{Schema} from "mongoose";

const reviewSchema=new Schema({
    
        reviewText: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            lowercase:true
        },
   
    movieId:{
        type:Number,
        required:true
    },
    movieTitle:{
        type:String,
        required:true
    },
    profileImage:{
        type:String
    },
   
    rating:{
        type:Number,
        required:true
    },
    spoiler:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export const Review=mongoose.model('Review',reviewSchema)