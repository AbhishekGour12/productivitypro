import express from 'express';
const router = express.Router();
import { getExpenses, createExpense, getExpenseSummary, getExpenseById, updateExpense, deleteExpense } from '../controllers/ExpenseController.js';
import { protect } from '../middleware/authmiddleware.js';

// Apply protect middleware to all routes in this file
router.use(protect);

router.route('/').get(getExpenses).post(createExpense);
router.route('/summary').get(getExpenseSummary);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);
export default router;
