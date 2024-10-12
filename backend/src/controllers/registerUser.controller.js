import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateAccessAndRefreshToken=async (userId)=>{
    try{
    const user=await User.findById(userId);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.refreshToken=refreshToken;
    user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};
    }
    catch(err)
    {
        throw new APIError(500,"Error during generation of access Token and Refresh Token");
    }
}

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

const loginUser=asyncHandler(async(req,res)=>{
    const {username,password}=req.body;
    if(username.trim()==""||password.trim()=="")
        throw new APIError(400,"Fields should not be empty");
    const registered=await User.findOne({username});
    if(!registered)
        throw new APIError(400,"User does not exists");
    const isPasswordValid=await registered.isPasswordMatches(password)
    if(!isPasswordValid)
    {
        throw new APIError(400,"password is incorrect.Try again");
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(registered._id);
    const options={
        httpOnly:true,
        secure:true,
    };
    res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({
        status:200,
        message:"User logged in successfully",
    });
});

const logoutUser=asyncHandler(async (req,res)=>{
    const user=await User.findByIdAndUpdate(req.user._id,{
        $set:{refreshToken:undefined}
      });
      const options={
        httpOnly:true,
        secure:true,
      }
      res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json({
        message:"User logged out successfully",
      }); 
})

export {registerUser,loginUser,logoutUser};