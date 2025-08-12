import express from "express";
import { 
  setupAdmin,
  patientRegister,
  login,
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Setup & Auth
router.post("/setup-admin", setupAdmin);
router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/doctor/addnew", addNewDoctor);

// Get user details
router.get("/me", isAuthenticated, getUserDetails);
router.get("/patient/me", isAuthenticated, getUserDetails);
router.get("/admin/me", isAuthenticated, getUserDetails);

// Admin & Doctor management
router.post("/admin/register", addNewAdmin);

router.post("/doctor/register", addNewDoctor);
router.get("/doctors", getAllDoctors);
router.post("/admin/addnew", addNewAdmin);


// Logout routes
router.get("/logout/admin", logoutAdmin);
router.get("/logout/patient", logoutPatient);

// Universal logout (clears both tokens)
router.get("/logout", (req, res) => {
  res
    .status(200)
    .cookie("adminToken", "", { httpOnly: true, expires: new Date(0) })
    .cookie("patientToken", "", { httpOnly: true, expires: new Date(0) })
    .json({ success: true, message: "Logged out successfully!" });
});

export default router;
