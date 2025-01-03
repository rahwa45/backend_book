import express from "express";
import { Book } from "../models/bookModel.js";

import { verifyToken } from "../authMiddleware.js";

const router = express.Router();

// Add Book Route
router.post("/", verifyToken, async (req, res) => {
  console.log(req.body);
  console.log("File:", req.file);

  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
      image: req.body.image,
      userId: req.user.userId,
    };

    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

// Route for getting books for the logged-in user (protected route)
router.get("/", verifyToken, async (req, res) => {
  try {
    // Find books by userId (only return books for the logged-in user)
    const books = await Book.find({ userId: req.user.userId });

    // const books = await Book.findById(req.params.id);

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for getting a book by ID (protected route)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    console.log("user id ", book.userId);
    console.log("id ", id);
    // // Ensure the book belongs to the logged-in user

    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for updating a book (protected route)
router.put("/:id", verifyToken, async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Ensure the book belongs to the logged-in user

    // Update the book
    const result = await Book.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).send({
      message: "Book updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for deleting a book (protected route)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Ensure the book belongs to the logged-in user

    // Delete the book
    await Book.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
