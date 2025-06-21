import {body} from "express-validator"

const UserRegistrationValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .toLowerCase()
        .isEmail().withMessage("Email is invalid") ,

        body("username")
        .trim()
        .notEmpty().withMessage("username is required")
        .isLength({min:3}).withMessage("username must be grater than this length"),
        

        body("password")
        .notEmpty().withMessage("password is required")
        .isLength({min:6}).withMessage("password must contain atleast 8 chrecter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@$!%*?&)")
    ]
}


const UserLoginValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .toLowerCase()
        .isEmail().withMessage("Email is invalid") ,

        body("password")
        .notEmpty().withMessage("password is required")
        .isLength({min:6}).withMessage("password must contain atleast 8 chrecter")
    ]
}

export {UserRegistrationValidator , UserLoginValidator}