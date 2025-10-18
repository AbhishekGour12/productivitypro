import Expense from '../models/Expense.js';
import Task from '../models/Task.js';
import asyncHandler from 'express-async-handler';

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
const getDashboardOverview = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { period = 'month' } = req.query;

        // Get current date and calculate date ranges
        const now = new Date();
        let startDate, endDate = now;

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

        // Get financial stats
        const expenses = await Expense.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        });
      

        const totalIncome = expenses
            .filter(exp => exp.type === 'income')
            .reduce((sum, exp) => sum + exp.amount, 0);

        const totalExpense = expenses
            .filter(exp => exp.type === 'expense')
            .reduce((sum, exp) => sum + exp.amount, 0);

        const remainingBalance= totalIncome - totalExpense;
        const netBalance = -remainingBalance;

        // Get previous period for comparison
        const prevStartDate = new Date(startDate);
        const prevEndDate = new Date(startDate);

        switch (period) {
            case 'week':
                prevStartDate.setDate(prevStartDate.getDate() - 7);
                prevEndDate.setDate(prevEndDate.getDate() - 1);
                break;
            case 'month':
                prevStartDate.setMonth(prevStartDate.getMonth() - 1);
                break;
            case 'quarter':
                prevStartDate.setMonth(prevStartDate.getMonth() - 3);
                break;
            case 'year':
                prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
                break;
        }

        const prevExpenses = await Expense.find({
            user: userId,
            date: { $gte: prevStartDate, $lte: prevEndDate }
        });

        const prevTotalIncome = prevExpenses
            .filter(exp => exp.type === 'income')
            .reduce((sum, exp) => sum + exp.amount, 0);

        const prevTotalExpense = prevExpenses
            .filter(exp => exp.type === 'expense')
            .reduce((sum, exp) => sum + exp.amount, 0);

        // Calculate changes
        const incomeChange = prevTotalIncome > 0
            ? ((totalIncome - prevTotalIncome) / prevTotalIncome * 100).toFixed(1)
            : '0.0';

        const expenseChange = prevTotalExpense > 0
            ? ((totalExpense - prevTotalExpense) / prevTotalExpense * 100).toFixed(1)
            : '0.0';

        const prevNetBalance = prevTotalIncome - prevTotalExpense;
        const balanceChange = prevNetBalance > 0
            ? ((netBalance - prevNetBalance) / prevNetBalance * 100).toFixed(1)
            : '0.0';

        // Get task stats
        const tasks = await Task.find({ user: userId });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;
        const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

        // Today's tasks
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayTasks = await Task.find({
            user: userId,
            dueDate: { $gte: today, $lt: tomorrow },
            status: { $ne: 'completed' }
        }).countDocuments();
       
        res.json({
            success: true,
            data: {
                financialStats: {
                    totalIncome,
                    totalExpense,
                    netBalance,
                    incomeChange: `${incomeChange > 0 ? '+' : ''}${incomeChange}%`,
                    expenseChange: `${expenseChange > 0 ? '+' : ''}${expenseChange}%`,
                    balanceChange: `${balanceChange > 0 ? '+' : ''}${balanceChange}%`
                },
                taskStats: {
                    totalTasks,
                    completedTasks,
                    pendingTasks,
                    inProgressTasks,
                    todayTasks
                }
            }
        });
    } catch (error) {
        console.error('Dashboard overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard overview'
        });
    }
});

// @desc    Get financial statistics
// @route   GET /api/dashboard/financial-stats
// @access  Private
const getFinancialStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
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

        const expenses = await Expense.find({
            user: userId,
            date: { $gte: startDate }
        });

        const totalIncome = expenses
            .filter(exp => exp.type === 'income')
            .reduce((sum, exp) => sum + exp.amount, 0);

        const totalExpense = expenses
            .filter(exp => exp.type === 'expense')
            .reduce((sum, exp) => sum + exp.amount, 0);

        const netBalance = totalIncome - totalExpense;

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netBalance,
                period
            }
        });
    } catch (error) {
        console.error('Financial stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching financial statistics'
        });
    }
});

// @desc    Get task statistics
// @route   GET /api/dashboard/task-stats
// @access  Private
const getTaskStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
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

        const tasks = await Task.find({
            user: userId,
            createdAt: { $gte: startDate }
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;
        const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

        // High priority tasks
        const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

        // Overdue tasks
        const overdueTasks = tasks.filter(task =>
            task.status !== 'completed' &&
            new Date(task.dueDate) < new Date()
        ).length;

        res.json({
            success: true,
            data: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                highPriorityTasks,
                overdueTasks,
                period
            }
        });
    } catch (error) {
        console.error('Task stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching task statistics'
        });
    }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activities
// @access  Private
const getRecentActivities = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 6 } = req.query;

        // Get recent expenses
        const recentExpenses = await Expense.find({ user: userId })
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .select('title amount type category date description');

        // Get recent tasks
        const recentTasks = await Task.find({ user: userId })
            .sort({ dueDate: 1 })
            .limit(parseInt(limit))
            .select('title priority dueDate status category description');
        
        const expenses = [
            ...recentExpenses.map(expense => ({
                type: 'expense',
                id: expense._id,
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                date: expense.date,
                description: expense.description,
                priority: expense.type
            })),
          
        ].sort((a, b) => new Date(b.date || b.dueDate) - new Date(a.date || a.dueDate))
            .slice(0, limit);
        const tasks = [
              ...recentTasks.map(task => ({
                type: 'task',
                id: task._id,
                title: task.title,
                priority: task.priority,
                dueDate: task.dueDate,
                status: task.status,
                category: task.category,
                description: task.description
            }))
        ].sort((a, b) => new Date(b.date || b.dueDate) - new Date(a.date || a.dueDate))
            .slice(0, limit);

        res.json({
            success: true,
            expenses: expenses,
            tasks: tasks
        });
    } catch (error) {
        console.error('Recent activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching recent activities'
        });
    }
});

// @desc    Get expense chart data
// @route   GET /api/dashboard/expense-chart
// @access  Private
const getExpenseChartData = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
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

        const expenses = await Expense.find({
            user: userId,
            date: { $gte: startDate },
            type: 'expense'
        });

        // Group by category
        const categoryData = expenses.reduce((acc, expense) => {
            const category = expense.category || 'Other';
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += expense.amount;
            return acc;
        }, {});

        // Convert to array format for chart
        const chartData = Object.entries(categoryData).map(([name, value]) => ({
            name,
            value: parseFloat(value.toFixed(2))
        }));

        // Add income vs expense comparison
        const incomeExpenseData = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId), // Fixed this line
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const income = incomeExpenseData.find(item => item._id === 'income')?.total || 0;
        const expense = incomeExpenseData.find(item => item._id === 'expense')?.total || 0;

        res.json({
            success: true,
            data: {
                categories: chartData,
                summary: {
                    income: parseFloat(income.toFixed(2)),
                    expense: parseFloat(expense.toFixed(2)),
                    net: parseFloat((income - expense).toFixed(2))
                }
            }
        });
    } catch (error) {
        console.error('Expense chart error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching expense chart data'
        });
    }
});


// @desc    Get task progress data
// @route   GET /api/dashboard/task-progress
// @access  Private
const getTaskProgressData = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
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

        const tasks = await Task.find({
            user: userId,
            createdAt: { $gte: startDate }
        });

        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        const priorityCounts = tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});

        // Weekly completion rate (last 4 weeks)
        const weeklyData = [];
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const weekTasks = tasks.filter(task =>
                new Date(task.createdAt) >= weekStart &&
                new Date(task.createdAt) <= weekEnd
            );

            const completed = weekTasks.filter(task => task.status === 'completed').length;
            const total = weekTasks.length;

            weeklyData.push({
                week: `Week ${4 - i}`,
                completed,
                total,
                rate: total > 0 ? (completed / total * 100).toFixed(1) : 0
            });
        }

        res.json({
            success: true,
            data: {
                status: {
                    completed: statusCounts.completed || 0,
                    pending: statusCounts.pending || 0,
                    'in-progress': statusCounts['in-progress'] || 0
                },
                priority: {
                    high: priorityCounts.high || 0,
                    medium: priorityCounts.medium || 0,
                    low: priorityCounts.low || 0
                },
                weeklyProgress: weeklyData,
                totalTasks: tasks.length
            }
        });
    } catch (error) {
        console.error('Task progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching task progress data'
        });
    }
});

export {
    getDashboardOverview,
    getFinancialStats,
    getTaskStats,
    getRecentActivities,
    getExpenseChartData,
    getTaskProgressData
};