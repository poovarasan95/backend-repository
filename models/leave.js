import mongoose from "mongoose"

const leaveSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },
    startDate:{type:Date},
    endDate:{type:Date},
    reason:String,
    default: [],
    appliedAt:{type:Date,default:Date.now},
})
const leave = mongoose.model("leave",leaveSchema) ;
export default leave;