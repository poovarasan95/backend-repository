import mongoose from "mongoose"


const adminSchema =new mongoose.Schema({
    name : {type:String,required:true},
    email : {type:String,required:true},
    password : {type:String,required:true},
    role: { type: String, enum: ['student', 'admin'], default: 'admin' },
    createAt : {type:Date,default:Date.now},
    updateAt : {type:Date,default:Date.now}
})

const Admin = mongoose.model("Admin",adminSchema) ;
export default Admin;