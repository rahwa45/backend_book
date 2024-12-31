import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const router = express.Router();

//Route for User Sign Up
const SECRET_KEY =
  "iprhdfkn.ndknhfdhfdklfkjldskjlfkjldfkjldskjlfjdsklfjkldskjlfkjldsfkjldskjlfkjldsfkjldskjlfkjldsfkjldskjlfdskjlfkjldskjlfdskjlfkjldfknjds";

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Check if the username or email is already registered

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    //Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    //Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//Route for User Login

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;

    //Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Check if the password is correct

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token with userId included

    const token = jwt.sign({ userId: user._id, isLogged: true }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
