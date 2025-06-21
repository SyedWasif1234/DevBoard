import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponce } from "../utils/api-responce.js";
import { ApiError } from "../utils/api-error.js";
import { UserRegistrationValidator } from "../validator/index.js";
import crypto from "crypto";
import { User } from "../models/user.models.js";
import { sendEmail , emailVerificationMailgenContent , forgotPasswordMailgenContent } from "../utils/mail.js";
import { Console } from "console";


const GenerateAccessRefreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    const RefreshToken = user.generateRefreshToken();
    const AccessToken = user.generateAccessToken();
    user.refreshToken = RefreshToken ;
    await user.save()
    console.log("refresh token :", RefreshToken)
    console.log("access token :", AccessToken)
    return {RefreshToken , AccessToken };

  } catch (error) {
    res.status(400).json( new ApiError(400 , "error occcured in GenerateAccessRefreshToken"))
  }
};


 const registerUser = asyncHandler(async (req, res) => {
    
  console.log("hey i am from register user")
    const { email, username, password, role } = req.body;  
    
    console.log(email , username )
    const existingUser = await User.findOne({email});

    if(existingUser){
      res.status(409).json( new ApiError(409 , "user alreay existed"))
    }

    const user = await User.create({
      username ,
      email,
      password,
      role
    });

    console.log(user)

    if(!user){
      res.status(404).json(new ApiError(404 , "failed to creare a user"))
    }

    const token = crypto.randomBytes(32).toString("hex")
    user.varificationToken = token;

    await user.save()

    const varification_URL = `${process.env.BASE_URL}/api/v1/users/verify/${token}`
    await sendEmail({
      email:user.email ,
      subject:'Welcome to Task Maneger',
      mailgenContent : emailVerificationMailgenContent(user.username , varification_URL)

    })

    res.status(200).json( new ApiResponce(200 , "user registered Successfully" ))
  
    
  });

  const verifyEmail = asyncHandler(async (req, res) => {

  const {token} = req.params;
  if(!token){
    res.status(400).json( new ApiResponce(400 , "token not found"))
  }

  const user = await User.findOne({varificationToken:token});
  if(!user){
    res.status(404 , "User not found Invalid Token")
  }

  user.isEmailVerified = true ;
  user.varificationToken = undefined;
  await user.save();

  res.status(202).json( new ApiResponce(202 , "user varified Successfully"))
    
  });
  
  const loginUser = asyncHandler(async (req, res) => {
   
    const {email , password} = req.body;
    const user = await User.findOne({email})
    if(!user){
      res.status(404).json(new ApiResponce(404, "user not found"))
    }

    console.log(user)
    const isMatch = await user.isPasswordCorrect(password)
    if(!isMatch){
      res.status(400).json(new ApiError(400 , "Incorrect Password"))
    }
    console.log("password is true",isMatch)
    const {RefreshToken , AccessToken} = await  GenerateAccessRefreshToken(user._id);
   
    console.log("refresh token : ",RefreshToken)
    const LoggedinUser = await User.findById(user._id).select("-password -refreshToken")
    const options ={
      httpOnly: true,
      secure: true
      // jb ye dono true krte hai then cookies is modifiable only from server
  }

  res
  .status(200)
  .cookie("accessToken",AccessToken,options)
  .cookie("refreshToken",RefreshToken,options)
  .json(
      new ApiResponce(201,{

          user: LoggedinUser,AccessToken, RefreshToken

      },"user logged in succesfully")
  )

  });
  
  const logoutUser = asyncHandler(async (req, res) => {
    
  const user = await User.findById(req.user._id)
  if(!user){
    res.status(400).json(new ApiError(400 , " user not found"))
  }
  
  user.refreshToken = undefined

  await user.save()

  const options ={
      httpOnly: true,
      secure: true
      // jb ye dono true krte hai then cookies is modifiable only from server
  }

  res.status(200).json(new ApiResponce(200 , "user loged out successfully"))

  });
  
  
  const resendEmailVerification = asyncHandler(async (req, res) => {
    
    //let say user is already logind
    const user_id = req.user._id;
    const user = await User.findById(user_id)
    if(!user){
      res.status(400).json( new ApiError(400 , "user not found "));
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.varificationToken = token ;
    await user.save()

    const varification_URL = `${process.env.BASE_URL}/api/v1/users/verify/${token}`
    await sendEmail({
      email:user.email ,
      subject:'Email varification',
      mailgenContent : emailVerificationMailgenContent(user.username , varification_URL)

    })

    res.status(202).json(new ApiResponce(202 , "Email resend varification successfull"))


  });


  const forgotPasswordRequest = asyncHandler(async (req, res) => {
      const {username} = req.body ;
      if(!username){
        res.status(400).json( new ApiError(400 ,"username is required"))
      }
      const user = await User.findOne({username})
      if(!user){
        res.status(400).json(new ApiError(400 , "user not found"))
      }

      const token = crypto.randomBytes(32).toString("hex");
      user.forgotPasswordToken = token ;
      user.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000 ;

      await user.save()

      const varificationURl = ` ${process.env.BASE_URL}/api/v1/users/ForgotPassword/${token}`

      await sendEmail({
        email:user.email ,
        subject:'Click to Reset Password',
        mailgenContent : emailVerificationMailgenContent(user.username , varificationURl)
  
      })
  
      res.status(202).json(new ApiResponce(202 , "Reset password mail sent successfully"))
  

  });

  const resetForgottenPassword = asyncHandler(async (req, res) => {

    const{token} = req.params;
    const{password} = req.body;

    const user = await User.findOne({
      forgotPasswordToken:token,
      forgotPasswordExpiry: { $gt: Date.now() },
    })

    if(!user){
      res.status(400).json(new ApiError(400, "user not found"))
    }
    user.password = password;
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save();

    res.status(200).json(new ApiResponce(200 , "Password Reset successfull"))
    
  });
  
 
  const changeCurrentPassword = asyncHandler(async (req, res) => {
    const user_id = req.user._id
    const {password} = req.body
    const user = await User.findById(user_id)
    if(!user){
      res.status(400).json(new ApiError(400, "user not found"))
    }
    user.password = password
    await user.save()

    res.status(200).json(new ApiResponce(200 , "Password changed successfully"))



  });
  
  const getCurrentUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;
  
    //validation
  });
  
  export {
    changeCurrentPassword,
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    verifyEmail,
  };