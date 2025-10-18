import api from './api';

export const tasksAPI = {
    // Get all tasks with filters
    getTasks: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            // Add filter parameters
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });

            const response = await api.get(`/task?${params.toString()}`);
           
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get task by ID
    getTaskById: async (id) => {
        try {
            const response = await api.get(`/task/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new task
    createTask: async (taskData) => {
        try {
            const response = await api.post('/task', taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update task
    updateTask: async (id, taskData) => {
        try {
            const response = await api.put(`/task/${id}`, taskData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete task
    deleteTask: async (id) => {
        try {
            const response = await api.delete(`/task/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get task summary
    getTaskSummary: async (period = 'month') => {
        try {
            const response = await api.get(`/task/summary?period=${period}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update task status
    updateTaskStatus: async (id, status) => {
        try {
            const response = await api.patch(`/task/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk update tasks
    bulkUpdateTasks: async (taskIds, updateData) => {
        try {
            const response = await api.patch('/task/bulk-update', {
                taskIds,
                ...updateData
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Bulk delete tasks
    bulkDeleteTasks: async (ids) => {
        try {
            const response = await api.post('/task/bulk-delete', { ids });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};