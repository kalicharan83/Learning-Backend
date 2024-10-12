import Router from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/registerUser.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { JWTVerify } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]),registerUser);

router.route("/login").post(upload.none(),loginUser);

//secure routes
router.route("/logout").post(JWTVerify,logoutUser);
router.route("/refreshAccessToken").post(JWTVerify,refreshAccessToken);

export default router;