import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.patientToken || req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "Please login to continue!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "User not found!" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed!" });
  }
};

// Separate patient-only middleware
export const isPatientAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.patientToken;
    if (!token) {
      return res.status(401).json({ message: "Please login as a patient to book an appointment!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "Patient not found!" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Patient authentication failed!" });
  }
};
