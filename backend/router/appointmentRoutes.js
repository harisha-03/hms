import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postAppointment);
router.get("/getall", isAuthenticated, getAllAppointments);
router.put("/update/:id", isAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAuthenticated, deleteAppointment);

export default router;
