import {ApiResponce} from "../utils/api-responce.js"


const HealthCheck = async(req, res) =>{
    console.log("server is running")
   res.status(200).json(new ApiResponce (200 , {message:"server is running"}) ) 
} 

export {HealthCheck}