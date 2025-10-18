import Expense from "../models/Expense.js";


// @desc    Get all expenses for a user with filtering, sorting, and pagination
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
    const { page = 1, limit = 10, type, category, paymentMethod, startDate, endDate, sortBy = 'date', sortOrder = 'desc', search } = req.query;
    console.log(category)
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    try {
        const expenses = await Expense.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        console.log(expenses)
        const count = await Expense.countDocuments(query);

        res.json({
            expenses,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalExpenses: count,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new expense
// @route   POST /api/expenses
const createExpense = async (req, res) => {
    const { title, amount, type, category, paymentMethod, date, description } = req.body;
    try {
        const expense = new Expense({
            user: req.user._id,
            title, amount, type, category, paymentMethod, date, description
        });

        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense && expense.user.toString() === req.user._id.toString()) {
            res.json(expense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        console.log(expense)
        if (expense && expense.user.toString() === req.user._id.toString()) {
            Object.assign(expense, req.body);
            const updatedExpense = await expense.save();
            console.log(updateExpense)
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense && expense.user.toString() === req.user._id.toString()) {
            await Expense.findByIdAndDelete(req.params.id)
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};


// @desc    Get expense summary for a user
// @route   GET /api/expenses/summary
const getExpenseSummary = async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                    totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalIncome: 1,
                    totalExpense: 1,
                    netBalance: { $subtract: ['$totalIncome', '$totalExpense'] }
                }
            }
        ]);

        const categoryBreakdown = await Expense.aggregate([
            { $match: { user: req.user._id, type: 'expense' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        res.json({ summary: summary[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0 }, categoryBreakdown });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export { getExpenses, createExpense, getExpenseById, updateExpense, deleteExpense, getExpenseSummary };
