import Income from "../models/Income.js";
import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// A simple icon map
const categoryIcons = {
  Salary: "fa-solid fa-money-check-dollar",
  Investment: "fa-solid fa-chart-line",
  Freelance: "fa-solid fa-seedling",
  Gift: "fa-solid fa-gift",
  Other: "fa-solid fa-money-bills",
};

// POST /api/income - Add a new income record
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

    const newIncome = await Income.create({
      user: req.user._id,
      amount,
      category,
      description,
      icon,
      date: date ? new Date(date) : undefined,
    });

    await newIncome.save();

    res.status(201).json(newIncome);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to add income.", error: error.message });
  }
});

// GET /api/income - Get all income records for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  const user = req.user._id;

  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    // Find all incomes belonging to the authenticated user
    const incomes = await Income.find({ user })
      .sort({ date: -1 }) // Sort by date descending
      .skip(skip)
      .limit(limit);

    const totalItems = await Income.countDocuments({ user });

    res.send({
        incomes,
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching income records.",
        error: error.message,
      });
  }
});

// 2. Routes for specific Income object

// GET /api/income/:id - Get a single income record
router.get("/:id", authMiddleware, async (req, res) => {
    const incomeId = req.params.id;
    try {
        // Validate the id format
        if (!mongoose.Types.ObjectId.isValid(incomeId)) {
            return res.status(404).json({ message: 'Invalid income id format.' });
        }
        const income = await Income.findOne({ _id: incomeId, user: req.user._id });
        if (!income) {
            return res.status(404).json({ message: "Income record not found." });
        }   
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: "Error fetching income record.", error: error.message });
    }
});

// PUT /api/income/:id - Update a single income record
router.put("/:id", authMiddleware, async (req, res) => {
    const incomeId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(incomeId)) {
            return res.status(404).json({ message: 'Invalid income ID format.' });
        }
        // Find the record by ID AND user ID, then update it.
        const updatedIncome = await Income.findOneAndUpdate(
            { _id: incomeId, user: req.user._id },
            { $set: req.body },
            // new returns the document after update was applied
            { new: true }
        );
        if (!updatedIncome) {
            return res.status(404).json({ message: "Income record not found." });
        }
        res.status(200).json(updatedIncome);
    } catch (error) {
        res.status(500).json({ message: "Error updating income record.", error: error.message });
    }
});

// DELETE /api/income/:id - Delete a single income record
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid income ID format.' });
        }

        const result = await Income.findOneAndDelete({ _id: id, user: req.user._id });

        if (!result) {
            return res.status(404).json({ message: 'Income record not found or unauthorized.' });
        }

        res.status(200).json({ message: 'Income record successfully deleted.', deletedId: id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete income.', error: error.message });
    }
});

export default router;
