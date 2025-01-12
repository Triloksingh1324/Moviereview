import mongoose,{Schema, Types} from "mongoose";
// import { Review } from "./Review.model.js";
const ReplySchema=new Schema({
    parentId:{
        type:Schema.Types.ObjectId,
        ref:"Review"
    },
    reviewText:{
        type:String,
        required:true
    },
    username:{
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
    },
    profileImage:{
        type:String
    }
},{timestamps:true})

export const Reply=mongoose.model('Reply',ReplySchema)

