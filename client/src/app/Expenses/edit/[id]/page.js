'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExpenseForm from '@/app/components/forms/ExpenseForm';
import Link from 'next/link';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { expensesAPI } from '@/app/lib/expenses';
import toast from 'react-hot-toast';

export default function EditExpensePage({ params }) {
    const id = React.use(params)
    const router = useRouter();
    const [expenseData, setExpenseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchExpenseData();
    }, [id]);

    const fetchExpenseData = async () => {
        try {
            setIsLoading(true);
            const response = await expensesAPI.getExpenseById(id.id);
            console.log(response)
            setExpenseData(response);
        } catch (error) {
            console.error('Error fetching expense:', error);
            toast.error('Failed to load expense data');
            router.push('/expenses');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!expenseData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Expense Not Found</h2>
                    <p className="text-gray-600 mb-4">The expense you're trying to edit doesn't exist.</p>
                    <Link href="/Expenses">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Back to Expenses
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/expenses"
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <FaArrowLeft />
                        <span>Back to Expenses</span>
                    </Link>
                </div>
            </div>

            {/* Page Title */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
                    <FaEdit className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Edit Expense</h1>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                    Update your expense details and keep your financial records accurate.
                </p>
            </div>

            {/* Expense Form */}
            <ExpenseForm initialData={expenseData} />
        </div>
    );
}