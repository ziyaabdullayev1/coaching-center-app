// controllers/tasksController.js
const taskService = require("../services/taskService");

// GET /api/tasks
exports.getTasks = async (req, res) => {
  const { data, error } = await taskService.getAllTasks();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/tasks
exports.addTask = async (req, res) => {
  const task = req.body;
  const { data, error } = await taskService.createTask(task);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const task = req.body;
  const { data, error } = await taskService.updateTask(id, task);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await taskService.deleteTask(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Task deleted", data });
};

// GET /api/tasks/goal/:goal_id
exports.getTasksByGoal = async (req, res) => {
  const { goal_id } = req.params;
  const { data, error } = await taskService.getTasksByGoalId(goal_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
