import leave from "../models/leave.js"
 

//Get all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await leave.find().populate('studentId');
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


 // status: "approved" or "rejected"
export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedLeave = await leave.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(updatedLeave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};