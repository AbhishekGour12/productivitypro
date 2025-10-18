'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { FaArrowLeft, FaEdit, FaTrash, FaDollarSign, FaCalendarAlt, FaTags, FaCreditCard, FaInfoCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { expensesAPI } from '../../lib/expenses';
import toast from 'react-hot-toast';

const DetailItem = ({ icon: Icon, label, value, valueClass = 'text-gray-800' }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center text-sm text-gray-500 mb-2">
            <Icon className="mr-2" />
            <span className="font-medium">{label}</span>
        </div>
        <p className={`text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
);

export default function ExpenseDetailsPage({ params }) {
    const id = React.use(params);
   
    const router = useRouter();
    const [expense, setExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchExpense();
    }, [id]);

    const fetchExpense = async () => {
        try {
            setIsLoading(true);
            const response = await expensesAPI.getExpenseById(id.id);
            setExpense(response);
        } catch (error) {
            console.error('Error fetching expense:', error);
            toast.error('Failed to load expense details');
            // router.push('/expenses');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
            return;
        }

        try {
            setIsDeleting(true);
            await expensesAPI.deleteExpense(id.id);
            toast.success('Expense deleted successfully');
            router.push('/Expenses');
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast.error('Failed to delete expense');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="text-center p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Expense Not Found</h2>
                    <p className="text-gray-600 mb-4">The expense you're looking for doesn't exist.</p>
                    <Link href="/expenses">
                        <Button>Back to Expenses</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const isIncome = expense.type === 'income';
    const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedAmount = isIncome ? `+$${expense.amount.toFixed(2)}` : `-$${expense.amount.toFixed(2)}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/Expenses"
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <FaArrowLeft />
                        <span>Back to Expenses</span>
                    </Link>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                    <Link href={`/Expenses/edit/${expense._id}`}>
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <FaEdit className="mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        onClick={handleDelete}
                        isLoading={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <FaTrash className="mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Expense Details Card */}
            <Card className={`border-l-4 ${isIncome ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <div className="p-6">
                    {/* Expense Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {isIncome ? <FaArrowUp className="text-xl" /> : <FaArrowDown className="text-xl" />}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{expense.title}</h1>
                                    <p className="text-gray-600 mt-1">{expense.description}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${isIncome
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                {expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}
                            </span>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <p className={`text-3xl font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                {formattedAmount}
                            </p>
                        </div>
                    </div>

                    {/* Expense Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <DetailItem
                            icon={FaCalendarAlt}
                            label="Date"
                            value={formattedDate}
                        />
                        <DetailItem
                            icon={FaTags}
                            label="Category"
                            value={expense.category}
                        />
                        <DetailItem
                            icon={FaCreditCard}
                            label="Payment Method"
                            value={expense.paymentMethod}
                        />
                        <DetailItem
                            icon={FaDollarSign}
                            label="Amount"
                            value={formattedAmount}
                            valueClass={isIncome ? 'text-green-600' : 'text-red-600'}
                        />
                    </div>

                    {/* Description */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                            <FaInfoCircle className="mr-2" />
                            <span className="font-medium">Description</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {expense.description || 'No description provided.'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}