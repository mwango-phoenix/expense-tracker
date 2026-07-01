import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const getSummary = async (req, res) => {
    const user = req.user._id;
    const { period = 'month', type = 'both', startDate, endDate } = req.query;

    // Define date format based on period
    const dateFormats = {
        day: "%Y-%m-%d",
        month: "%Y-%m",
        year: "%Y"
    };

    const format = dateFormats[period] || dateFormats.month;

    // Derive a default date range from `period` when explicit start/end
    // dates aren't provided, so e.g. `period=month` actually scopes results
    // to the current calendar month instead of matching all-time data.
    const getDefaultRange = (p) => {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);

        switch (p) {
            case 'day':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'week': {
                const dayOfWeek = start.getDay(); // 0 = Sunday
                start.setDate(start.getDate() - dayOfWeek);
                start.setHours(0, 0, 0, 0);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;
            }
            case 'year':
                start.setMonth(0, 1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(11, 31);
                end.setHours(23, 59, 59, 999);
                break;
            case 'month':
            default:
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(end.getMonth() + 1, 0);
                end.setHours(23, 59, 59, 999);
                break;
        }

        return { start, end };
    };

    try {
        const filteredDocs = { user: user };

        if (startDate || endDate) {
            filteredDocs.date = {};
            if (startDate) filteredDocs.date.$gte = new Date(startDate);
            if (endDate) filteredDocs.date.$lte = new Date(endDate);
        } else {
            const { start, end } = getDefaultRange(period);
            filteredDocs.date = { $gte: start, $lte: end };
        }

        // Function to build aggregation pipeline
        const buildPipeline = (collectionType) => [
            { $match: filteredDocs },
            
            { $group: {
                _id: {
                    $dateToString: {
                        format: format,
                        date: "$date"
                    }
                },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }},
            
            { $sort: { _id: 1 } },
            
            { $project: {
                _id: 0,
                period: "$_id",
                total: { $round: ["$total", 2] },
                count: "$count",
                type: collectionType
            }}
        ];

        let results = {};

        // Aggregate income
        if (type === 'income' || type === 'both') {
            const Income = mongoose.model('Income');
            results.income = await Income.aggregate(buildPipeline('income'));
        }

        // Aggregate expenses
        if (type === 'expense' || type === 'both') {
            const Expense = mongoose.model('Expense');
            results.expenses = await Expense.aggregate(buildPipeline('expense'));
        }

        // Calculate net (income - expenses) if both requested
        if (type === 'both') {
            const periods = new Set([
                ...results.income.map(i => i.period),
                ...results.expenses.map(e => e.period)
            ]);

            results.net = Array.from(periods).map(period => {
                const incomeItem = results.income.find(i => i.period === period);
                const expenseItem = results.expenses.find(e => e.period === period);
                
                const incomeTotal = incomeItem?.total || 0;
                const expenseTotal = expenseItem?.total || 0;
                
                return {
                    period,
                    total: Math.round((incomeTotal - expenseTotal) * 100) / 100,
                    income: incomeTotal,
                    expenses: expenseTotal
                };
            }).sort((a, b) => a.period.localeCompare(b.period));
        }

        // Add overall summary
        const summary = {
            totalIncome: results.income?.reduce((sum, i) => sum + i.total, 0) || 0,
            totalExpenses: results.expenses?.reduce((sum, e) => sum + e.total, 0) || 0,
            transactionCount: {
                income: results.income?.reduce((sum, i) => sum + i.count, 0) || 0,
                expenses: results.expenses?.reduce((sum, e) => sum + e.count, 0) || 0
            }
        };
        summary.net = summary.totalIncome - summary.totalExpenses;

        // Add category breakdown for expenses
        if (type === 'expense' || type === 'both') {
            const Expense = mongoose.model('Expense');
            const categoryBreakdown = await Expense.aggregate([
                { $match: filteredDocs },
                {
                    $group: {
                        _id: "$category",
                        total: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { total: -1 } },
                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        total: { $round: ["$total", 2] },
                        count: "$count"
                    }
                }
            ]);

            // Convert to object format
            summary.categoryBreakdown = {};
            categoryBreakdown.forEach(item => {
                summary.categoryBreakdown[item.category] = item.total;
            });
        }

        res.status(200).json({
            period,
            summary,
            data: results
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error calculating summary.', 
            error: error.message 
        });
    }
};

router.get('/summary', authMiddleware, getSummary);

export default router;
