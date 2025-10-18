import api from '../lib/api';

export const dashboardAPI = {
  // Get dashboard overview
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Dashboard API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch dashboard data',
        data: null
      };
    }
  },

  // Get financial stats
  getFinancialStats: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/financial-stats?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Financial stats API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch financial stats',
        data: null
      };
    }
  },

  // Get task statistics
  getTaskStats: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/task-stats?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Task stats API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch task stats',
        data: null
      };
    }
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/recent-activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Recent activities API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch recent activities',
        data: []
      };
    }
  },

  // Get expense summary for charts
  getExpenseChartData: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/expense-chart?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Expense chart API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch expense chart data',
        data: { categories: [], summary: { income: 0, expense: 0, net: 0 } }
      };
    }
  },

  // Get task progress for charts
  getTaskProgressData: async (period = 'month') => {
    try {
      const response = await api.get(`/dashboard/task-progress?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Task progress API Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch task progress data',
        data: { status: { completed: 0, pending: 0, 'in-progress': 0 }, priority: { high: 0, medium: 0, low: 0 }, weeklyProgress: [], totalTasks: 0 }
      };
    }
  }
};