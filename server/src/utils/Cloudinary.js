import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary=async(localPath)=>{
    try {
        if (!localPath) return null
        const uploadResult = await cloudinary.uploader
       .upload(
           localPath, {
               resource_type:"image",
           }
       )
       console.log("file is uploaded on cloudinary",uploadResult.url)
       return uploadResult
    } catch (error) {
        fs.unlinkSync(localPath)
        return null
    }
}

export {uploadOnCloudinary}