import { cookie } from "express-validator";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import cookieParser from "cookie-parser";

 export const isLogedIn = async(req, res , next) => {

    try {
        
        console.log("cookie from auth middleware",req.cookies);

        const token = req.cookies?.accessToken ;
        console.log("Token :", token);
        if(!token){
            res.status(400).json( new ApiError(400, "plz login " ))
        }

        const Decoded_Token = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET  )
        console.log("Decoded data :" , Decoded_Token)

        req.user = Decoded_Token;

        next();

    } catch (error) {
        res.status(404).json( new ApiError(404 , "somthing went wrong in auth islogedIn middleware" , error))
    }
}

