import express from 'express';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskSummary,
  updateTaskStatus,
  bulkUpdateTasks,
  bulkDeleteTasks,
} from '../controllers/TaskController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// Core CRUD routes
router.route('/').get(getTasks).post(createTask);
router.route('/summary').get(getTaskSummary);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

// ✅ Extra routes to match your frontend tasksAPI
router.patch('/:id/status', updateTaskStatus);
router.patch('/bulk-update', bulkUpdateTasks);
router.post('/bulk-delete', bulkDeleteTasks);

export default router;
