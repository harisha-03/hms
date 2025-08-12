export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  // Send token in cookie (for frontend browser)
  res
    .status(statusCode)
    .cookie(
      user.role === "Admin" ? "adminToken" : "patientToken",
      token,
      {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      }
    )
    .json({
      success: true,
      message,
      token, // <-- return token here too
      user,
    });
};
