import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { getDashboardOverview, getExpenseChartData, getFinancialStats, getRecentActivities, getTaskProgressData, getTaskStats } from '../controllers/DashboardController.js';
const router = express.Router();



// All dashboard routes require authentication
router.use(protect);

// Dashboard overview
router.get('/overview', getDashboardOverview);

// Financial statistics
router.get('/financial-stats', getFinancialStats);

// Task statistics
router.get('/task-stats', getTaskStats);

// Recent activities
router.get('/recent-activities', getRecentActivities);

// Expense chart data
router.get('/expense-chart', getExpenseChartData);

// Task progress data
router.get('/task-progress', getTaskProgressData);

export default router;