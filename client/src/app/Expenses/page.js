'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ExpenseCard from '../components/expenses/ExpenseCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FaPlus, FaFilter, FaSearch, FaSort, FaDownload, FaSync } from 'react-icons/fa';
import { expensesAPI } from '../lib/expenses';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';

export default function Expenses() {
    const router = useRouter();
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        category: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 6
    });
    const [summary, setSummary] = useState();
    const [totalPage, setTotalPage] = useState();
    // Fetch expenses
    const fetchExpenses = async () => {
        try {
            setIsLoading(true);
            const response = await expensesAPI.getExpenses(filters);
            console.log(response)
            setExpenses(response?.expenses);
            setTotalPage(response.totalPages)

            // If we have summary in response, update it
            if (response.data?.summary) {
                setSummary(response.data.summary);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            toast.error('Failed to load expenses');
            // Set mock data if API fails
            setExpenses([
                {
                    id: 1,
                    title: 'Coffee Shop',
                    description: 'Morning coffee and pastries with team',
                    amount: 18.5,
                    type: 'expense',
                    category: 'Food & Dining',
                    paymentMethod: 'Credit Card',
                    date: '2025-10-07',
                    tags: ['breakfast', 'team']
                },
                {
                    id: 2,
                    title: 'Grocery Shopping - Walmart',
                    description: 'Weekly groceries including fresh produce and household items',
                    amount: 185.5,
                    type: 'expense',
                    category: 'Shopping',
                    paymentMethod: 'Debit Card',
                    date: '2025-10-06',
                    tags: ['weekly', 'essentials']
                },
                {
                    id: 3,
                    title: 'Freelance Project Payment',
                    description: 'Website design project for client - Project Aurora',
                    amount: 1200,
                    type: 'income',
                    category: 'Freelance',
                    paymentMethod: 'Bank Transfer',
                    date: '2025-10-05',
                    tags: ['project', 'payment']
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch expense summary
    const fetchExpenseSummary = async () => {
        try {
            const response = await expensesAPI.getExpenseSummary('month');
            console.log(response)

            setSummary(response.summary)
            console.log(summary)
        } catch (error) {
            console.error('Error fetching summary:', error);
            // Set mock summary if API fails
            setSummary({
                totalIncome: 6520.00,
                totalExpense: 1021.23,
                netBalance: 5498.77
            });
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchExpenseSummary();
    }, [filters]);

    const handleSearch = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value,
            page: 1 // Reset to first page on new search
        }));
    };

    const handleFilterChange = (key, value) => {
        console.log(key, value)
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: value
        }));
    };

    const handleDeleteExpense = async (id) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;

        try {
            await expensesAPI.deleteExpense(id);
            toast.success('Expense deleted successfully');
            fetchExpenses(); // Refresh the list
            fetchExpenseSummary(); // Refresh summary
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast.error('Failed to delete expense');
        }
    };

    const handleRefresh = () => {
        fetchExpenses();
        fetchExpenseSummary();
    };

    const handleAddExpense = () => {
        router.push('/Expenses/add');
    };

    return (
        <>
            <Header />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
                        <p className="text-gray-600 mt-2">Manage your income and expenses effectively.</p>
                    </div>
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                        <Button
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            onClick={handleAddExpense}
                        >
                            <FaPlus className="mr-2" />
                            Add Expense
                        </Button>
                        <Button
                            className="bg-gray-600 hover:bg-gray-700 border border-gray-600"
                            onClick={handleRefresh}
                            isLoading={isLoading}
                        >
                            <FaSync className="mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200">
                        <div className="text-center p-4">
                            <p className="text-sm text-green-800 font-medium">Total Income</p>
                            <p className="text-2xl font-bold text-green-900">₹{summary?.totalIncome.toFixed(2)}</p>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-r from-red-50 to-pink-100 border border-red-200">
                        <div className="text-center p-4">
                            <p className="text-sm text-red-800 font-medium">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-900">₹{summary?.totalExpense.toFixed(2)}</p>
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-r from-blue-50 to-cyan-100 border border-blue-200">
                        <div className="text-center p-4">
                            <p className="text-sm text-blue-800 font-medium">Net Balance</p>
                            <p className="text-2xl font-bold text-blue-900">₹{-summary?.netBalance.toFixed(2)}</p>
                        </div>
                    </Card>
                </div>

                {/* Filters & Search */}
                <Card className="bg-gradient-to-r from-gray-50 to-purple-50 border border-purple-100">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 w-full">
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search expenses..."
                                    value={filters.search}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                <option value="Food">Food</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Bills">Bills</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                            {expenses?.length} transactions
                        </div>
                    </div>
                </Card>

                {/* Expenses Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {expenses?.map(expense => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    onDelete={handleDeleteExpense}
                                />
                            ))}
                        </div>

                        {expenses?.length === 0 && (
                            <Card className="text-center py-12">
                                <p className="text-gray-500 text-lg">No expenses found</p>
                                <p className="text-gray-400 mt-2">Try adjusting your filters or add a new expense.</p>
                            </Card>
                        )}

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">1-{expenses?.length}</span> of{' '}
                                <span className="font-semibold">{expenses?.length}</span> transactions
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
                                    onClick={() => handleFilterChange('page', filters.page - 1)}
                                    disabled={filters.page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex space-x-1">
                                    {Array.from({ length: totalPage }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handleFilterChange('page', page)}
                                            className={`w-10 h-10 rounded-lg font-medium ${page === filters.page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300"
                                    onClick={() => handleFilterChange('page', filters.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}