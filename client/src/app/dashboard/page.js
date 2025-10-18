'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/app/components/dashboard/StatCard';
import ExpensePieChart from '@/app/components/dashboard/ExpensePieChart';
import TaskBarChart from '@/app/components/dashboard/TaskBarChart';
import Card from '@/app/components/ui/Card';
import {
    FaDollarSign,
    FaCreditCard,
    FaBalanceScale,
    FaTasks,
    FaArrowUp,
    FaArrowDown,
    FaCalendar,
    FaExclamationTriangle,
    FaSync
} from 'react-icons/fa';
import Header from '../components/layout/Header';
import { dashboardAPI } from '../lib/dashboard';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch all dashboard data
    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);

            // Fetch dashboard overview (this should include everything)
            const dashboardResponse = await dashboardAPI.getDashboardData();
            const recentExpenses = await dashboardAPI.getRecentActivities();
            console.log(recentExpenses)

            if (dashboardResponse.success) {
                setDashboardData(dashboardResponse.data);

                // If the API response includes recent activities, use them
                if (recentExpenses) {
                    setRecentExpenses(recentExpenses.expenses);
                    setRecentTasks(recentExpenses.tasks)
                }

            } else {
                throw new Error(dashboardResponse.message || 'Failed to fetch dashboard data');
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);

            // Set comprehensive fallback mock data
            setDashboardData({
                financialStats: {
                    totalIncome: 6520.00,
                    totalExpense: 1021.23,
                    netBalance: 5498.77,
                    incomeChange: '+12.5%',
                    expenseChange: '+3.2%',
                    balanceChange: '+8.7%'
                },
                taskStats: {
                    totalTasks: 15,
                    completedTasks: 8,
                    pendingTasks: 5,
                    inProgressTasks: 2,
                    todayTasks: 2
                }
            });

            setRecentExpenses([
                {
                    id: 1,
                    title: 'Coffee Shop',
                    amount: -18.5,
                    date: '2025-10-07',
                    type: 'expense',
                    category: 'Food',
                    description: 'Morning coffee and pastries'
                },
                {
                    id: 2,
                    title: 'Grocery Shopping',
                    amount: -185.5,
                    date: '2025-10-06',
                    type: 'expense',
                    category: 'Shopping',
                    description: 'Weekly groceries'
                },
                {
                    id: 3,
                    title: 'Freelance Payment',
                    amount: 1200,
                    date: '2025-10-05',
                    type: 'income',
                    category: 'Freelance',
                    description: 'Website design project'
                },
                {
                    id: 4,
                    title: 'Uber Rides',
                    amount: -28.5,
                    date: '2025-10-05',
                    type: 'expense',
                    category: 'Transportation',
                    description: 'Transportation to office'
                },
                {
                    id: 5,
                    title: 'Gas Station',
                    amount: -52,
                    date: '2025-10-04',
                    type: 'expense',
                    category: 'Transportation',
                    description: 'Fuel for car'
                },
            ]);

            setRecentTasks([
                {
                    id: 1,
                    title: 'Fix Production Bug',
                    priority: 'high',
                    dueDate: '2025-10-03',
                    status: 'completed',
                    category: 'Work',
                    description: 'Resolved critical authentication bug'
                },
                {
                    id: 2,
                    title: 'Database Migration',
                    priority: 'high',
                    dueDate: '2025-10-05',
                    status: 'completed',
                    category: 'Work',
                    description: 'Successfully migrated production database'
                },
                {
                    id: 3,
                    title: 'Monthly Budget Review',
                    priority: 'medium',
                    dueDate: '2025-10-07',
                    status: 'pending',
                    category: 'Finance',
                    description: 'Review September expenses'
                },
                {
                    id: 4,
                    title: 'Gym Workout Session',
                    priority: 'medium',
                    dueDate: '2025-10-08',
                    status: 'pending',
                    category: 'Personal',
                    description: 'Complete full body workout'
                },
                {
                    id: 5,
                    title: 'Review Team Code PRs',
                    priority: 'high',
                    dueDate: '2025-10-09',
                    status: 'in-progress',
                    category: 'Work',
                    description: 'Review and provide feedback on PRs'
                },
            ]);

            toast.error('Using demo data. Backend connection failed.');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        toast.success('Dashboard updated!');
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </>
        );
    }

    const financialStats = dashboardData?.financialStats || {
        totalIncome: 6520.00,
        totalExpense: 1021.23,
        netBalance: 5498.77,
        incomeChange: '+12.5%',
        expenseChange: '+3.2%',
        balanceChange: '+8.7%'
    };

    const taskStats = dashboardData?.taskStats || {
        totalTasks: 15,
        completedTasks: 8,
        pendingTasks: 5,
        inProgressTasks: 2,
        todayTasks: 2
    };

    return (
        <>
            <Header />
            <div className="space-y-6 p-3">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                        <p className="text-gray-600 mt-2">Here's your productivity and financial overview for today.</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4 sm:mt-0"
                    >
                        <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                        <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Income"
                        value={`$${financialStats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        change={financialStats.incomeChange}
                        icon={FaDollarSign}
                        color="text-green-600"
                        bgColor="bg-green-50"
                        trend="up"
                    />
                    <StatCard
                        title="Total Expense"
                        value={`₹${financialStats.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        change={financialStats.expenseChange}
                        icon={FaCreditCard}
                        color="text-red-600"
                        bgColor="bg-red-50"
                        trend="down"
                    />
                    <StatCard
                        title="Net Balance"
                        value={`₹${financialStats.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        change={financialStats.balanceChange}
                        icon={FaBalanceScale}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                        trend="up"
                    />
                    <StatCard
                        title="Active Tasks"
                        value={taskStats.totalTasks.toString()}
                        change={`+${taskStats.todayTasks} today`}
                        icon={FaTasks}
                        color="text-purple-600"
                        bgColor="bg-purple-50"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
                        <div className="flex items-center justify-between mb-6 p-3">
                            <h3 className="text-lg font-semibold text-gray-800">Expense Distribution</h3>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaCreditCard className="text-blue-600 text-sm" />
                            </div>
                        </div>
                        <ExpensePieChart />
                    </Card>
                    <Card className="bg-gradient-to-br from-white to-green-50 border border-green-100">
                        <div className="flex items-center justify-between mb-6 p-3">
                            <h3 className="text-lg font-semibold text-gray-800">Task Progress</h3>
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaTasks className="text-green-600 text-sm" />
                            </div>
                        </div>
                        <TaskBarChart
                            completed={taskStats.completedTasks}
                            pending={taskStats.pendingTasks}
                            inProgress={taskStats.inProgressTasks}
                        />
                    </Card>
                </div>

                {/* Recent Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Expenses */}
                    <Card className="border border-gray-200 hover:border-purple-300 transition-colors duration-300 p-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaDollarSign className="mr-2 text-purple-600" />
                                Recent Transactions
                            </h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Last 5 days
                            </span>
                        </div>
                        {recentExpenses.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No recent transactions found.
                            </div>
                        ) : (
                            <ul className="space-y-3   " >
                                {recentExpenses?.map(exp => (
                                    <li key={exp.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${exp.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {exp.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{exp.title}</p>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <FaCalendar className="mr-1 text-xs" />
                                                    {new Date(exp.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={`font-bold text-lg ${exp.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {exp.type === 'income' ? `+₹${Math.abs(exp.amount).toFixed(2)}` : `-₹${Math.abs(exp.amount).toFixed(2)}`}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    {/* Recent Tasks */}
                    <Card className="border border-gray-200 hover:border-orange-300 transition-colors duration-300 p-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaTasks className="mr-2 text-orange-600" />
                                Recent Tasks
                            </h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {taskStats.pendingTasks + taskStats.inProgressTasks} Pending
                            </span>
                        </div>
                        {recentTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No recent tasks found.
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {recentTasks?.map(task => (
                                    <li key={task.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}></div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{task.title}</p>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <FaCalendar className="mr-1 text-xs" />
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${task.priority === 'high'
                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                            : task.priority === 'medium'
                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                : 'bg-green-100 text-green-800 border border-green-200'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}