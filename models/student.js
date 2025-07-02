import mongoose from "mongoose"


const studentSchema = mongoose.Schema({
    username : {type:String,required:true},
    standard : {type:String,required:true},
    section : {type:String,required:true},
    register : {type:String,required:true,unique:true},
    gender : {type:String,required:true},
    password : {type:String,required:true},
    leaveBalance: { type: Number, default: 10 },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    createAt : {type:Date,default:Date.now},
    updateAt : {type:Date,default:Date.now}
})

const student = mongoose.model("student",studentSchema) ;
export default student;