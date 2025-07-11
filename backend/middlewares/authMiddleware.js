import jwt from "jsonwebtoken";

import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";


const protect = asyncHandler(async(req,res,next)=>{
    let token;

    token = req.cookies.jwt;

   if(token){ try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {

        console.log(error)

        res.status(401);
        throw new Error('Not authorized, token failed')


        
    }}else{
        res.status(401);
        throw new Error('Not authorized, token failed')

    }
})


const Admin = asyncHandler(async(req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error('Not authorized, token failed')

    }
})

export {protect,Admin};