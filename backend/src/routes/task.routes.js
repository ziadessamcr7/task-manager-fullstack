const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');

// All task routes require authentication
router.use(authenticateToken);

// GET /api/tasks - Get all tasks for authenticated user
router.get('/', getTasks);

// POST /api/tasks - Create a new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

module.exports = router;

