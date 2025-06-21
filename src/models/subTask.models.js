import mongoose , {Schema} from "mongoose";

const subtaskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    task:{
        type:Schema.Types.ObjectId,
        ref:"Task"
    },
    isCompleted:{
        type:Boolean,
        defalut:false
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const SubTask = mongoose.model("SubTask", subtaskSchema);