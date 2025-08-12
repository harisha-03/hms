// resetAdminPassword.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js"; // adjust if needed

dotenv.config({ path: "./config/config.env" });

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const newPassword = "Harry$9999"; // new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await User.updateOne(
      { email: "mmharisha7@gmail.com" }, // your admin email
      { $set: { password: hashedPassword } }
    );

    if (updated.modifiedCount > 0) {
      console.log(`Password reset successfully! New password: ${newPassword}`);
    } else {
      console.log("No user found with this email.");
    }

    process.exit();
  } catch (err) {
    console.error("Error resetting password:", err.message);
    process.exit(1);
  }
};

resetPassword();
