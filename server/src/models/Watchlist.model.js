import mongoose,{Schema} from "mongoose";

const watchListSchema=new Schema({
    
      
        username: {
            type: String,
            required: true,
            lowercase:true
        },
   
    movieId:{
        type:Number,
        required:true,
    },
    movieTitle:{
        type:String
    },
    profileImage:{
        type:String
    },
  
    // rating:{
    //     type:Number,
    //     required:true
    // }
},{timestamps:true})

export const WatchList=mongoose.model('WatchList',watchListSchema)