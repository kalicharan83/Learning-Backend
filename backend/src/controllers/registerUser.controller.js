import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser=asyncHandler(async(req,res)=>{
    const {username,fullname,email,password}=req.body;
    // validations
    const registered=await User.findOne({
        $or:[{username},{email}]
    });
    if(registered)
    throw new APIError(409,"Username or email already exists");

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath)
        throw new APIError(409,"Avatar is required");
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar)
        throw new APIError(409,"Avatar is required");
    const user=await User.create({
        fullname,
        username,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
    });
    const response=await User.findById(user._id).select("-password -refreshToken");
    if(!response)
        throw new APIError(500,"Internal  error");
    res.status(201).json(
        new APIResponse(201,response,"Registered sucessfully")
    )
});

export {registerUser};