import jwt from "jsonwebtoken";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const JWTVerify=asyncHandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
    if(!token)
        throw new APIError(400,"Unauthorized Access");
    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(!decodedToken)
        throw new APIError(404,"Unauthorized access");
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
    req.user=user;
    next();
});

export {JWTVerify};