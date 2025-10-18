import express from 'express';
import { protect, admin } from '../middleware/authmiddleware.js';
import { 
    getAdminStats, 
    getAllUsers, 
    getAllExpenses, 
    getAllTasks, 
    deleteUser, 
    updateUser,
    getExpenseAnalytics,
    getUserActivity
} from '../controllers/AdminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// Admin dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

// Data management
router.get('/expenses', getAllExpenses);
router.get('/tasks', getAllTasks);

// Analytics
router.get('/analytics/expenses', getExpenseAnalytics);
router.get('/analytics/user-activity', getUserActivity);

export default router;