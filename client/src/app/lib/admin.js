import api from '../lib/api';

export const adminAPI = {
  // Get admin dashboard stats
  getAdminStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Admin stats API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch admin stats',
        data: null
      };
    }
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Get all users API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch users',
        data: { users: [], totalPages: 0, currentPage: 1, total: 0 }
      };
    }
  },

  // Get all expenses
  getAllExpenses: async (params = {}) => {
    try {
      const response = await api.get('/admin/expenses', { params });
      return response.data;
    } catch (error) {
      console.error('Get all expenses API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch expenses',
        data: { expenses: [], totalPages: 0, currentPage: 1, total: 0 }
      };
    }
  },

  // Get all tasks
  getAllTasks: async (params = {}) => {
    try {
      const response = await api.get('/admin/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Get all tasks API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch tasks',
        data: { tasks: [], totalPages: 0, currentPage: 1, total: 0 }
      };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Delete user API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete user'
      };
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update user'
      };
    }
  },

  // Get expense analytics
  getExpenseAnalytics: async (period = 'month') => {
    try {
      const response = await api.get(`/admin/analytics/expenses?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Expense analytics API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch expense analytics',
        data: null
      };
    }
  },

  // Get user activity
  getUserActivity: async (period = 'month') => {
    try {
      const response = await api.get(`/admin/analytics/user-activity?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('User activity API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch user activity',
        data: null
      };
    }
  }
};