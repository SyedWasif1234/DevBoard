import {Router} from "express"
import { HealthCheck } from "../controllers/healthcare.controler.js"

const router = Router()
console.log("i am inside health care router")
router.route("/").get(HealthCheck)
console.log("i am after route")
export default router