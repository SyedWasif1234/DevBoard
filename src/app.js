import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extends:true}))


import HealthCareRouter from "./router/HealthCare.router.js"
import AuthUserRouter from "./router/auth.router.js"


app.use("/api/v1/healthcare", HealthCareRouter)
app.use("/api/v1/users", AuthUserRouter)

export default app