 import student from "../models/student.js"
 import leave from "../models/leave.js"
 import bcrypt from "bcryptjs"
 import jwt from "jsonwebtoken"
 import Admin from "../models/admin.js";
 
 
 
 //Signup
 export const signupUser = async(req,res)=>{
   try {
    const {username,standard,section,register,gender,password}=req.body;
    const existingRegister = await student.findOne({register})
    const existingUsername = await student.findOne({username})

    if(existingRegister || existingUsername){
        return res.status(400).json({error : "Already Existing Register"})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const newStudent = new student({
        username,standard,section,register,gender,password:hashedPassword
    })
    if(newStudent){
        await newStudent.save();
       return res.status(200).json(newStudent);
    }
    else{
        res.status(400).json({message : "Invalid Data"})
    }
   } catch (error) {
    console.log(`error in signup controller:${error}`)
    res.status(500).json({error: "internal server error"})
   }
}


//Login page
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body || {};

  try {
    // Try Admin login
    const adminUser = await Admin.findOne({ email: identifier });
    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: "Wrong password" });
      }

      const token = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_KEY);
      return res.status(200).json({
        token,
        role: 'admin',
        admin: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email
        }
      });
    }

    // Try Student login
    const studentData = await student.findOne({ register: identifier });
    if (studentData) {
      const isMatch = await bcrypt.compare(password, studentData.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: "Wrong password" });
      }

      const token = jwt.sign({ id: studentData._id, role: 'student' }, process.env.JWT_KEY);
      return res.status(200).json({
        token,
        role: 'student',
        student: {
          id: studentData._id,
          name: studentData.username,
          register: studentData.register
        }
      });
    }
    return res.status(404).json({ success: false, error: "User not found" });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};



//Leave Apply
export const leaveformUser = async (req,res)=>{
    const token = req.headers.authorization?.split(' ')[1];
  const { startDate, endDate, reason } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const studentData = await student.findOne({_id:decoded.id});

    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    if (start < today) return res.status(400).send({ error: 'Cannot apply on past date' });

    const overlappingLeave = await leave.findOne({
      studentId:decoded.id,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    });
  
    if (overlappingLeave) {
      return res.status(400).json({ error: 'You have already applied for leave on these dates.' });
    }
    

     const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
  if (studentData.leaveBalance < days ) {
    return res.status(400).json({ error: "Not enough leave balance" });
  }
  const warning = (start === today) ? 'Leave applied for today' : null;


  
    const newLeave = new leave({studentId:decoded.id, startDate,endDate, reason });
    await newLeave.save();

    studentData.leaveBalance -= days;
  await studentData.save();


  
    res.json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error:error.stack});
    
  }
};

// Cancel upcoming leave
export const leaveCancelUser=async(req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const leaveId = req.body.id;
    if (!leaveId) {
      return res.status(400).json({ message: 'Leave ID required' });
    }
    const leavedata = await leave.findById(leaveId);
    if (!leavedata) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    const today = new Date();
    if (new Date(leavedata.startDate) <= today) {
      return res.status(400).json({ message: 'Cannot cancel past or same-day leave' });
    }
    const duration =
      Math.ceil((new Date(leavedata.endDate) - new Date(leavedata.startDate)) / (1000 * 60 * 60 * 24)) + 1;

    await leavedata.deleteOne({studentId:decoded.id});
    const user = await student.findOne({_id:decoded.id});
    user.leaveBalance += duration;
    await user.save();
    res.json({ message: 'Leave cancelled and balance updated' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


// studentinfo 
export const studentinfoUser=async(req,res)=>{
    const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const studentData = await student.findOne({_id:decoded.id});
    res.json(studentData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Unauthorized' });
  }
};

//leaveHistory

export const leaveHistoryUser=async(req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
try {
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const leaveData = await leave.find({studentId:decoded.id})
  res.json(leaveData);
} catch (error) {
  res.status(500).json({ error: 'Unauthorized' });
}
};


//user information update
export const studentinfoUpdateUser = async (req,res)=>{
  const token = req.headers.authorization?.split(' ')[1];
const { username, register,standard,section } = req.body;
try {
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const studentData = await student.findByIdAndUpdate({_id:decoded.id},{ username, register,standard,section },{ new: true });
  res.json(studentData);
} catch (err) {
  res.status(500).json({ message: "Error updating user details" });
}
}



