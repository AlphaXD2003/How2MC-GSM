const { ApiErrors } = require("../utils/ApiErrors")
const jwt = require('jsonwebtoken')
const User = require('../models/user.model');
const { ApiResponse } = require("../utils/ApiResponse");
const verifyJWT = async(req, res, next) => {
    try {
       
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        //console.log('Cokkies: ' , req.cookies);
        if (!token) {
            throw new ApiErrors(401, "Token not found")
        }
        const deocodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(deocodedToken?._id).select('-password -refreshToken');
        if(!user){
            throw new ApiErrors(401, "User not found for the token")
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        return res.status(401).json(new ApiResponse(401, error.message))
    }
}
const verifyAdminJWT = async(req, res, next) => {
    try {
       
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        //console.log('Cokkies: ' , req.cookies);
        if (!token) {
            throw new ApiErrors(401, "Token not found")
        }
        const deocodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(deocodedToken?._id).select('-password -refreshToken');
        if(!user){
            throw new ApiErrors(401, "User not found for the token")
        }
        if(!user.isAdmin){
            throw new ApiErrors(401, "User not admin")
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        return res.status(401).json(new ApiResponse(401, error.message))
    }
}

module.exports = {
    verifyJWT,
    verifyAdminJWT
}