import User from '../models/User.js';
import Expense from '../models/Expense.js';
import Task from '../models/Task.js';
import asyncHandler from 'express-async-handler';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();
        
        // Get financial stats across all users
        const expenses = await Expense.find();
        const totalIncome = expenses
            .filter(exp => exp.type === 'income')
            .reduce((sum, exp) => sum + exp.amount, 0);
        
        const totalExpenses = expenses
            .filter(exp => exp.type === 'expense')
            .reduce((sum, exp) => sum + exp.amount, 0);
        
        const netBalance = totalIncome - totalExpenses;

        // Get tasks stats
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        const pendingTasks = await Task.countDocuments({ status: 'pending' });

        // Get recent users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    recent: recentUsers
                },
                financial: {
                    totalIncome,
                    totalExpenses,
                    netBalance
                },
                tasks: {
                    total: totalTasks,
                    completed: completedTasks,
                    pending: pendingTasks
                }
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching admin statistics'
        });
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        
        const query = search 
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
});

// @desc    Get all expenses across all users
// @route   GET /api/admin/expenses
// @access  Private/Admin
const getAllExpenses = asyncHandler(async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            type = '', 
            category = '',
            startDate = '',
            endDate = '' 
        } = req.query;

        let query = {};
        
        if (type) query.type = type;
        if (category) query.category = category;
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const expenses = await Expense.find(query)
            .populate('user', 'name email')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Expense.countDocuments(query);

        res.json({
            success: true,
            data: {
                expenses,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        console.error('Get all expenses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching expenses'
        });
    }
});

// @desc    Get all tasks across all users
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = asyncHandler(async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status = '', 
            priority = '',
            category = '' 
        } = req.query;

        let query = {};
        
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;

        const tasks = await Task.find(query)
            .populate('user', 'name email')
            .sort({ dueDate: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Task.countDocuments(query);

        res.json({
            success: true,
            data: {
                tasks,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            }
        });
    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tasks'
        });
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Delete user's expenses and tasks
        await Expense.deleteMany({ user: user._id });
        await Task.deleteMany({ user: user._id });
        
        // Delete user
        await User.findByIdAndDelete(user._id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting user'
        });
    }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    createdAt: updatedUser.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user'
        });
    }
});

// @desc    Get expense analytics
// @route   GET /api/admin/analytics/expenses
// @access  Private/Admin
const getExpenseAnalytics = asyncHandler(async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Get expense distribution by category
        const categoryData = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: startDate },
                    type: 'expense'
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Get monthly expense trend
        const monthlyTrend = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: new Date(now.getFullYear(), 0, 1) },
                    type: 'expense'
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Get top users by spending
        const topUsers = await Expense.aggregate([
            {
                $match: {
                    date: { $gte: startDate },
                    type: 'expense'
                }
            },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$amount' },
                    transactionCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalSpent: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            }
        ]);

        res.json({
            success: true,
            data: {
                categoryDistribution: categoryData,
                monthlyTrend,
                topUsers
            }
        });
    } catch (error) {
        console.error('Expense analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching expense analytics'
        });
    }
});

// @desc    Get user activity analytics
// @route   GET /api/admin/analytics/user-activity
// @access  Private/Admin
const getUserActivity = asyncHandler(async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // User registration trend
        const registrationTrend = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);

        // Active users (users with activities in the period)
        const activeUsers = await Expense.distinct('user', {
            date: { $gte: startDate }
        });

        // User engagement stats
        const userStats = await User.aggregate([
            {
                $lookup: {
                    from: 'expenses',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'expenses'
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'tasks'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    createdAt: 1,
                    expenseCount: { $size: '$expenses' },
                    taskCount: { $size: '$tasks' },
                    lastActivity: { $max: ['$createdAt', { $max: '$expenses.date' }, { $max: '$tasks.createdAt' }] }
                }
            },
            {
                $sort: { lastActivity: -1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                registrationTrend,
                activeUsers: activeUsers.length,
                userStats
            }
        });
    } catch (error) {
        console.error('User activity analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user activity'
        });
    }
});

export {
    getAdminStats,
    getAllUsers,
    getAllExpenses,
    getAllTasks,
    deleteUser,
    updateUser,
    getExpenseAnalytics,
    getUserActivity
};