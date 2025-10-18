import api from './api';

export const expensesAPI = {
    // Get all expenses with filters
    getExpenses: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            // Add filter parameters
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });

            const response = await api.get(`/expenses?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get expense by ID
    getExpenseById: async (id) => {
        try {
            const response = await api.get(`/expenses/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new expense
    createExpense: async (expenseData) => {
        try {
            const response = await api.post('/expenses', expenseData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update expense
    updateExpense: async (id, expenseData) => {
        try {
            const response = await api.put(`/expenses/${id}`, expenseData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete expense
    deleteExpense: async (id) => {
        try {
            const response = await api.delete(`/expenses/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get expense summary
    getExpenseSummary: async (period = 'month') => {
        try {
            const response = await api.get(`/expenses/summary?period=${period}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get expenses by category
    getExpensesByCategory: async (startDate, endDate) => {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/expenses/category/summary?${params.toString()}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk delete expenses
    bulkDeleteExpenses: async (ids) => {
        try {
            const response = await api.post('/expenses/bulk-delete', { ids });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};