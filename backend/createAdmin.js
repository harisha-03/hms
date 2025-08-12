import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

import { User } from "./models/userSchema.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Use plain password -> let pre-save hook hash automatically
    const admin = new User({
      firstName: "Harisha",
      lastName: "Mutkuru",       // At least 3 characters
      email: "mmharisha7@gmail.com",
      phone: "7090409790",       // Exactly 10 digits
      nic: "12345",              // Exactly 5 digits
      dob: "2004-07-16",
      gender: "Male",
      password: "Harry$9999",    // Plain password
      role: "Admin",
    });

    await admin.save();
    console.log("Admin created successfully!");
    console.log("Email: mmharisha7@gmail.com");
    console.log("Password: Harry$9999");

    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
