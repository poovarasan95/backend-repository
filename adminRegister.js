import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/admin.js'; 

mongoose.connect('mongodb://127.0.0.1:27017/students');

const adminRegister = async () => {
  try {
    const hashPassword = await bcrypt.hash("admin", 10);
    const newAdmin = new Admin({
      name: "admin",
      email: "admin@gmail.com",
      password: hashPassword,
      roll:"admin",
    });
    await newAdmin.save();
    console.log('Admin created');
  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

adminRegister();