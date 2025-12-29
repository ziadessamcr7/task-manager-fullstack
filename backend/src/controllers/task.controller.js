const { dbGet, dbAll, dbRun } = require('../db/database');

/**
 * Get all tasks for the authenticated user
 */
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const tasks = await dbAll(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
};

/**
 * Create a new task
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in_progress', 'done'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'pending';

    // Insert new task
    const result = await dbRun(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description || null, taskStatus]
    );

    // Fetch the created task
    const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [result.id]);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
};

/**
 * Update an existing task
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    // Check if task exists and belongs to user
    const task = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in_progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, in_progress, or done'
      });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    // Add task id for WHERE clause
    values.push(id);

    // Update task
    await dbRun(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      [...values, userId]
    );

    // Fetch updated task
    const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if task exists and belongs to user
    const task = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Delete task
    await dbRun('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};

