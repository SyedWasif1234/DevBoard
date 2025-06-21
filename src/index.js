import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./DB/index.js";

dotenv.config({
    path:"./.env"
})

const PORT = process.env.PORT

connectDB()
.then(()=>{
    app.listen(PORT || 8000 , ()=>{
        console.log(`server connected to PORT ${PORT}`)
    })
})
.catch((err)=>{
    console.log("error occured while connecting to database" , err)
})