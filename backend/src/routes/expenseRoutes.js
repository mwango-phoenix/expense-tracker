import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import mongoose from 'mongoose';


const router = express.Router();

// POST /api/expense - Add a new expense record
router.post("/", authMiddleware, async (req, res) => {
  const { amount, category, description, icon, date } = req.body;
  try {
    if (!amount || !category || !icon) {
      return res
        .status(400)
        .json({ message: "Amount, category, and icon are required" });
    }
    if (amount < 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    const newExpense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      description,
      icon,
      date: date ? new Date(date) : undefined,
    });

    await newExpense.save();

    res.status(201).json(newExpense);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to add expense.", error: error.message });
  }
});

// GET /api/expense - Get all expense records for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  const user = req.user._id;

  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // Find all expenses belonging to the authenticated user
    const expenses = await Expense.find({ user })
      .sort({ date: -1 }) // Sort by date descending
      .skip(skip)
      .limit(limit);

    const totalItems = await Expense.countDocuments({ user });

    res.send({
        expenses,
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching expense records.",
        error: error.message,
      });
  }
});

// GET /api/expense/:id - Get a single expense record
router.get("/:id", authMiddleware, async (req, res) => {
    const expenseId = req.params.id;
    try {
        // Validate the id format
        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return res.status(404).json({ message: 'Invalid expense id format.' });
        }
        const expense = await Expense.findOne({ _id: expenseId, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: "Expense record not found." });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Error fetching expense record.", error: error.message });
    }
});

// PUT /api/expense/:id - Update a single expense record
router.put("/:id", authMiddleware, async (req, res) => {
    const expenseId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(expenseId)) {
            return res.status(404).json({ message: 'Invalid expense ID format.' });
        }
        // Find the record by ID AND user ID, then update it.
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: expenseId, user: req.user._id },
            { $set: req.body },
            // new returns the document after update was applied
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense record not found." });
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Error updating expense record.", error: error.message });
    }
});

// DELETE /api/expense/:id - Delete a single expense record
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid expense ID format.' });
        }

        const result = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

        if (!result) {
            return res.status(404).json({ message: 'Expense record not found or unauthorized.' });
        }

        res.status(200).json({ message: 'Expense record successfully deleted.', deletedId: id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete expense.', error: error.message });
    }
});

export default router;
