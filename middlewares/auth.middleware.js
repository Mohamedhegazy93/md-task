import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";


export const protectedRoute = async (req, res, next) => {
 
    const authorization = req.headers.cookie;
    if (!authorization) {
      return next (new ApiError('you cant perform this action'))
    }

    const token = authorization.split(" ")[0].slice(0, -1).split("=")[1];
    if (!token) {
      return next (new ApiError('you cant perform this action'))
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    const user = await User.findById(req.user.userId);
    if (!user) {
        return next(new ApiError("user not found", 401));
    }
    next();
  } 
 
