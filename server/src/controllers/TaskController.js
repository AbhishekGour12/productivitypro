import Task from "../models/Task.js";


const getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, category, sortBy = 'dueDate', sortOrder = 'asc', search } = req.query;

    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalTasks: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/task
 */
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, category } = req.body;
    const task = new Task({
      user: req.user._id,
      title,
      description,
      dueDate,
      status,
      priority,
      category,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/task/:id
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task && task.user.toString() === req.user._id.toString()) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Update task by ID
 * @route   PUT /api/task/:id
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/task/:id
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Get task summary for a user
 * @route   GET /api/task/summary
 */
const getTaskSummary = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ user: req.user._id, status: 'completed' });

    const statusBreakdown = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      statusBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Update task status
 * @route   PATCH /api/task/:id/status
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @desc    Bulk update multiple tasks
 * @route   PATCH /api/task/bulk-update
 */
const bulkUpdateTasks = async (req, res) => {
  try {
    const { taskIds, ...updateData } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: 'No task IDs provided' });
    }

    const result = await Task.updateMany(
      { _id: { $in: taskIds }, user: req.user._id },
      { $set: updateData }
    );

    res.json({ message: 'Tasks updated successfully', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * @desc    Bulk delete multiple tasks
 * @route   POST /api/task/bulk-delete
 */
const bulkDeleteTasks = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No task IDs provided' });
    }

    const result = await Task.deleteMany({ _id: { $in: ids }, user: req.user._id });
    res.json({ message: 'Tasks deleted successfully', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskSummary,
  updateTaskStatus,
  bulkUpdateTasks,
  bulkDeleteTasks,
};
