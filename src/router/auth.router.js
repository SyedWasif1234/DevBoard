import {Router} from "express"
import {
     registerUser ,
     verifyEmail ,
     loginUser,
     logoutUser,
     resendEmailVerification,
     forgotPasswordRequest,
     resetForgottenPassword,
     changeCurrentPassword
     } from "../controllers/auth.controler.js"
import { UserRegistrationValidator , UserLoginValidator } from "../validator/index.js"
import { validate } from "../middleware/validate.middleware.js"
import { isLogedIn } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(UserRegistrationValidator() , validate , registerUser)
router.route("/verify/:token").get(verifyEmail)
router.route("/login").post( UserLoginValidator() , validate , loginUser)
router.route("/logout").post(isLogedIn , logoutUser)
router.route("/resendEmailVrification").get(isLogedIn , resendEmailVerification)
router.route("/ForgotPassword").post(forgotPasswordRequest)
router.route("/ResetPassword/:token").post(resetForgottenPassword)
router.route("/changeCurrentPassword").post(isLogedIn , changeCurrentPassword)

export default router