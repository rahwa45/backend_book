import express from "express";
import jwt from "jsonwebtoken";

// Dummy database (same as in signupRoute.js)
let users = [];

const router = express.Router();

router.get("/verify/:token", (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { email } = decoded;

    // Find the user and update their verification status
    const user = users.find((u) => u.email === email);
    if (user) {
      user.isVerified = true;
      res.status(200).send("Email verified successfully!");
    } else {
      res.status(400).send("User not found.");
    }
  } catch (error) {
    res.status(400).send("Invalid or expired token.");
  }
});

export default router;
