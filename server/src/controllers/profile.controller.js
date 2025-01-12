import { asyncHanlder } from '../utils/asynchandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const removeProfileImage = asyncHanlder(async (req, res) => {
    const userId = req.user._id;

    try {
        const result = await User.findByIdAndUpdate(
            userId,
            { $unset: { profileImage: "" } },
            { new: true }
        );

        if (!result) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(
            new ApiResponse(201, result, "Profile Image Deleted Successfully")
        );
    } catch (err) {
        console.error("Error removing field:", err);
        throw new ApiError(401, "Error removing Image");
    }
});

export { removeProfileImage };
