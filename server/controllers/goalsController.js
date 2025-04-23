// controllers/goalsController.js
const goalService = require("../services/goalService");

// GET /api/goals
exports.getGoals = async (req, res) => {
  const { data, error } = await goalService.getAllGoals();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/goals
exports.addGoal = async (req, res) => {
  const goal = req.body;
  const { data, error } = await goalService.createGoal(goal);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
    const { id } = req.params;
    const updatedGoal = req.body;
  
    const { data, error } = await goalService.updateGoal(id, updatedGoal);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  };
  
  // DELETE /api/goals/:id
  exports.deleteGoal = async (req, res) => {
    const { id } = req.params;
  
    const { data, error } = await goalService.deleteGoal(id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Goal deleted successfully", data });
  };
  
  // GET /api/goals/student/:student_id
  exports.getGoalsByStudent = async (req, res) => {
    const { student_id } = req.params;
  
    const { data, error } = await goalService.getGoalsByStudentId(student_id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  };