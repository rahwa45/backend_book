import express from "express";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../mailer.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const router = express.Router();
const SECRET_KEY = "5676eghvndcbcvbncyugwkjdwddythgdbnddnbdjchdbcn";

let users = [];

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = {
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    };

    const newUser = new User(user);
    user.save();

    // Create a verification token (valid for 1 hour)
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

    // Send the verification email
    sendVerificationEmail(email, token);

    res
      .status(201)
      .send("User registered. Please check your email for verification.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
