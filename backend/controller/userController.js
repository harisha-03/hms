import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// ----------------- Setup Admin -----------------
export const setupAdmin = async (req, res) => {
  const adminEmail = "mmharisha7@gmail.com";
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: "Admin already exists",
        credentials: { email: adminEmail, password: "Harry$9999" },
      });
    }

    // Create default admin
    const admin = await User.create({
      firstName: "M",
      lastName: "Harisha",
      email: adminEmail,
      phone: "7090409790",
      nic: "12345",
      dob: "2004-07-16",
      gender: "Male",
      password: "Harry$9999",
      role: "Admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully!",
      credentials: { email: adminEmail, password: "Harry$9999" },
      admin,
    });
  } catch (error) {
    console.error("Setup Admin Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- Patient Register -----------------
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return next(new ErrorHandler("User already Registered!", 400));

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Patient",
  });

  generateToken(user, "User Registered!", 200, res);
});

// ----------------- Login -----------------
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Email Or Password!", 400));

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) return next(new ErrorHandler("Invalid Email Or Password!", 400));

  if (role !== user.role) return next(new ErrorHandler("User Not Found With This Role!", 400));

  generateToken(user, "Login Successfully!", 201, res);
});

// ----------------- Add Admin -----------------
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return next(new ErrorHandler("Admin With This Email Already Exists!", 400));

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });

  res.status(200).json({ success: true, message: "New Admin Registered", admin });
});

// ----------------- Add Doctor -----------------
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // Default avatar (if no file is uploaded)
  let avatar = {
    public_id: "default_avatar",
    url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  };

  // Upload only if file exists
  if (req.files && req.files.docAvatar) {
    const file = req.files.docAvatar;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(file.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, { folder: "avatars" });
    avatar = { public_id: uploaded.public_id, url: uploaded.secure_url };
  }

  const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) return next(new ErrorHandler("Doctor With This Email Already Exists!", 400));

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: avatar,
  });

  res.status(200).json({ success: true, message: "New Doctor Registered", doctor });
});

// ----------------- Get All Doctors -----------------
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" }).select(
    "firstName lastName email phone dob gender nic doctorDepartment docAvatar _id"
  );
  res.status(200).json({
    success: true,
    doctors,
  });
});


// ----------------- Get User Details -----------------
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});

// ----------------- Logout Admin -----------------
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.status(201).cookie("adminToken", "", { httpOnly: true, expires: new Date(Date.now()) }).json({
    success: true,
    message: "Admin Logged Out Successfully.",
  });
});

// ----------------- Logout Patient -----------------
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res.status(201).cookie("patientToken", "", { httpOnly: true, expires: new Date(Date.now()) }).json({
    success: true,
    message: "Patient Logged Out Successfully.",
  });
});
