import app from "./app.js";
import cloudinary from "cloudinary";
import { config } from "dotenv";
import cors from "cors";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRoutes.js";

config({ path: "./config/config.env" });

// CORS setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});
