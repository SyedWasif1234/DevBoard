import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

 export const validate = (req, res , next )=>{
    
   try {
     const errors = validationResult(req)
     if(errors.isEmpty() ){
          return next()
     }
 
     console.log(errors)
     console.log(errors.isEmpty())
 
     const ExtractedError = []
     errors.array().map((err)=>
         ExtractedError.push({
             [err.path]: err.msg,
         }),
     );
 
     console.log("erro occured in validate",ExtractedError)
 
     throw new ApiError(404 , "Recieved data is not valid", ExtractedError)
   } catch (error) {

    res.status(400).json(new ApiError(400 , "something went wrong in validate middleware"))
    
   }
}