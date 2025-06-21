import mongoose , {Schema} from "mongoose";
import { UserRoleEnum , AvialableUserRoles } from "../utils/constant.js";

const memberSchema = new Schema({
   user:{
    type:Schema.Types.ObjectId,
    ref:"User"
   },
   project:{
    type:Schema.Type.ObjectId,
    ref:"Project",
    required: true
   },
   role:{
    type:String,
    enum:AvialableUserRoles,
    default:UserRoleEnum.MEMBER
   }
},{timestamps:true})

export const ProjectMember = mongoose.model("ProjectMember", memberSchema);