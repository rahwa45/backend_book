import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import booksRoute from "./routes/booksRoute.js";

import dotenv from "dotenv";

dotenv.config();

import cors from "cors";

// Import body-parser (optional, if needed)
import bodyParser from "body-parser";

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware for parsing request body (use body-parser explicitly)
app.use(bodyParser.json()); // For JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded data

// Routes
app.use("/books", booksRoute);
app.use("/user", userRoute);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Welcome To MERN Stack Tutorial");
});

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
