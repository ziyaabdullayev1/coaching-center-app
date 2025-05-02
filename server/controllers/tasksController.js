const supabase = require("../services/supabaseClient");
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

// Öğrencinin görevlerini çek
// Öğrenciye ait görevleri, goal üzerinden al
// GET /api/tasks/student/:student_id
exports.getTasksByStudentId = async (req, res) => { 
  const studentId = req.params.student_id;

  // 1️⃣ Öğrenciye ait goal'ları al
  const { data: goals, error: goalError } = await supabase
    .from("goals")
    .select("id")
    .eq("student_id", studentId);

  if (goalError) {
    return res.status(500).json({ error: goalError.message });
  }

  const goalIds = goals.map(goal => goal.id);

  if (goalIds.length === 0) {
    return res.json([]); // Bu öğrenciye ait hiç goal yoksa
  }

  // 2️⃣ Bu goal_id'lere ait tüm görevleri getir
  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .in("goal_id", goalIds);

  if (taskError) {
    return res.status(500).json({ error: taskError.message });
  }

  res.json(tasks);
};




// Görevin tamamlanma durumunu güncelle
exports.toggleTaskCompleted = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await taskService.updateTaskCompleted(id, completed);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};