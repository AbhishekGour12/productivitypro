'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { expensesAPI } from '@/app/lib/expenses';

const ExpenseForm = ({ initialData = null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [expense, setExpense] = useState({
        title: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: 'Food',
        paymentMethod: 'Card',
    });

    useEffect(() => {
        if (initialData) {
            setExpense({
                ...initialData,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                amount: initialData.amount?.toString() || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const expenseData = {
                ...expense,
                amount: parseFloat(expense.amount),
                date: new Date(expense.date).toISOString()
            };

            if (initialData) {
                // Update existing expense
                await expensesAPI.updateExpense(initialData._id, expenseData);
                toast.success('Expense updated successfully!');
            } else {
                // Create new expense
                await expensesAPI.createExpense(expenseData);
                toast.success('Expense added successfully!');
            }

            router.push('/Expenses');
            router.refresh();
        } catch (error) {
            console.error('Error saving expense:', error);
            toast.error(error.message || 'Failed to save expense. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const categories = {
        expense: ['Food', 'Transportation', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'],
        income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Other']
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                    {initialData ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <p className="text-gray-600 mt-1">
                    {initialData ? 'Update your expense details' : 'Track your income and expenses'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <Input
                        name="title"
                        value={expense.title}
                        onChange={handleChange}
                        placeholder="e.g., Coffee Shop, Salary Payment"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount *
                        </label>
                        <Input
                            type="number"
                            name="amount"
                            value={expense.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date *
                        </label>
                        <Input
                            type="date"
                            name="date"
                            value={expense.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                        </label>
                        <Select
                            name="type"
                            value={expense.type}
                            onChange={handleChange}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <Select
                            name="category"
                            value={expense.category}
                            onChange={handleChange}
                        >
                            {categories[expense.type]?.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Method *
                        </label>
                        <Select
                            name="paymentMethod"
                            value={expense.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="Card">Credit/Debit Card</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>

                        </Select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={expense.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-200 resize-none"
                        placeholder="Add any additional details about this transaction..."
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        variant="secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        {initialData ? 'Update Expense' : 'Add Expense'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ExpenseForm;