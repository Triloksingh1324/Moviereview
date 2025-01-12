import mongoose,{Schema} from "mongoose"
const LikedSchema=new Schema({
    movieId:{
        type:Number
    },
    movieTitle:{
        type:String
    },
    user_Name:{
        type:String,
        lowercase:true
    }
},{timestamps:true})

export const Liked=mongoose.model("Like",LikedSchema)