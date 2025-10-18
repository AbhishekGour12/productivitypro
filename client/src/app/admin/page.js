'use client';
import { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
    FaUsers,
    FaDollarSign,
    FaCreditCard,
    FaTasks,
    FaSync,
    FaSearch,
    FaFilter,
    FaEdit,
    FaTrash,
    FaEye,
    FaRocket
} from 'react-icons/fa'
import { adminAPI } from '../lib/admin';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { logoutSuccess } from '../store/features/authSlice';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const user = useSelector((state) => state.auth)
    const [stats, setStats] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        type: '',
        category: ''
    });
    const router = useRouter()


    // Fetch admin data
    const fetchAdminData = async () => {
        try {
            setLoading(true);

            // Fetch stats
            const statsResponse = await adminAPI.getAdminStats();
            if (statsResponse.success) {
                setStats(statsResponse.data);
            }

            // Fetch expenses
            const expensesResponse = await adminAPI.getAllExpenses(filters);
            if (expensesResponse.success) {
                setExpenses(expensesResponse.data.expenses);
            }

        } catch (error) {
            console.error('Error fetching admin data:', error);

            // Fallback mock data
            setStats({
                users: { total: 1, recent: 0 },
                financial: { totalIncome: 6520.00, totalExpenses: 1021.23, netBalance: 5498.77 },
                tasks: { total: 15, completed: 8, pending: 5 }
            });

            setExpenses([
                {
                    _id: 1,
                    title: 'Coffee Shop',
                    user: { name: 'User 1', email: 'user@demo.com' },
                    amount: -18.5,
                    type: 'expense',
                    date: '2025-10-07',
                    category: 'Food'
                },
                {
                    _id: 2,
                    title: 'Grocery Shopping - Walmart',
                    user: { name: 'User 1', email: 'user@demo.com' },
                    amount: -185.5,
                    type: 'expense',
                    date: '2025-10-06',
                    category: 'Shopping'
                },
                {
                    _id: 3,
                    title: 'Freelance Project Payment',
                    user: { name: 'User 1', email: 'user@demo.com' },
                    amount: 1200,
                    type: 'income',
                    date: '2025-10-05',
                    category: 'Freelance'
                }
            ]);

            toast.error('Using demo data. Backend connection failed.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {

        dispatch(logoutSuccess());
        localStorage.removeItem('token');

        toast.success('Logged out successfully!');
        router.push('/Login');


    }

    // Handle refresh
    const handleRefresh = async () => {
        await fetchAdminData();
        toast.success('Admin data updated!');
    };


    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    // Handle delete expense
    const handleDeleteExpense = async (expenseId) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            // Note: You might want to add a delete expense endpoint for admin
            toast.success('Expense deletion would be implemented here');
        } catch (error) {
            toast.error('Failed to delete expense');
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [filters]);


    if (loading && !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-3">
            <div className='p-3 flex justify-between shadow-xl sticky-top'><Link href="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FaRocket className="text-lg" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">ProductivityPro</h1>
                    <p className="text-xs text-gray-500">Welcome, {user?.name || 'Admin'}</p>
                </div>
            </Link><button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white w-fit p-2 h-10 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300 ' onClick={logout}>Logout</button></div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">View and manage all users' data.</p>
                </div>
                <Button
                    onClick={handleRefresh}
                    className="bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0"
                >
                    <FaSync className="mr-2" />
                    Refresh Data
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.users?.total?.toString() || '0'}
                    change={stats?.users?.recent ? `+${stats.users.recent} recent` : ''}
                    icon={FaUsers}
                    color="#8B5CF6"
                />
                <StatCard
                    title="Total Income"
                    value={`$${stats?.financial?.totalIncome?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`}
                    icon={FaDollarSign}
                    color="#10B981"
                />
                <StatCard
                    title="Total Expenses"
                    value={`$${stats?.financial?.totalExpenses?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`}
                    icon={FaCreditCard}
                    color="#EF4444"
                />
                <StatCard
                    title="Total Tasks"
                    value={stats?.tasks?.total?.toString() || '0'}
                    change={stats?.tasks?.pending ? `${stats.tasks.pending} pending` : ''}
                    icon={FaTasks}
                    color="#F59E0B"
                />
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['overview', 'users', 'expenses', 'tasks', 'analytics'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Expenses Across All Users</h3>
                            <div className="flex space-x-2">
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Food">Food</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {expenses.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No expenses found.
                                </div>
                            ) : (
                                expenses.map((exp) => (
                                    <div key={exp._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <p className="font-semibold text-gray-800">{exp.title}</p>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {exp.user?.name || 'Unknown User'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                                <span>{exp.user?.email}</span>
                                                <span>{new Date(exp.date).toLocaleDateString()}</span>
                                                <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                                                    {exp.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${exp.type === 'income'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {exp.type === 'income'
                                                    ? `+$${Math.abs(exp.amount).toFixed(2)}`
                                                    : `-$${Math.abs(exp.amount).toFixed(2)}`
                                                }
                                            </span>
                                            <button
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                onClick={() => handleDeleteExpense(exp._id)}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {expenses.length > 0 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing {expenses.length} of many transactions
                                </p>
                                <div className="flex space-x-2">
                                    <Button
                                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        onClick={() => handleFilterChange('page', filters.page - 1)}
                                        disabled={filters.page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        onClick={() => handleFilterChange('page', filters.page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                )}

                {activeTab === 'users' && (
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">User Management</h3>
                        <p className="text-gray-500">User management interface would be implemented here.</p>
                    </Card>
                )}

                {activeTab === 'analytics' && (
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                        <p className="text-gray-500">Advanced analytics and charts would be displayed here.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}