// services/taskService.js
const supabase = require("./supabaseClient");

// Tüm görevleri getir
exports.getAllTasks = async () => {
  return await supabase.from("tasks").select("*");
};

// Yeni görev ekle
exports.createTask = async (task) => {
  return await supabase.from("tasks").insert([task]);
};

// Görev güncelle
exports.updateTask = async (id, task) => {
  return await supabase.from("tasks").update(task).eq("id", id);
};

// Görev sil
exports.deleteTask = async (id) => {
  return await supabase.from("tasks").delete().eq("id", id);
};

// Belirli hedefe ait görevleri getir
exports.getTasksByGoalId = async (goalId) => {
  return await supabase.from("tasks").select("*").eq("goal_id", goalId);
};

// Belirli bir öğrenciye ait görevleri getir
exports.getTasksByStudent = async (student_id) => {
  return await supabase.from("tasks").select("*").eq("student_id", student_id);
};

// Görevin completed durumunu güncelle
exports.updateTaskCompleted = async (id, completed) => {
  return await supabase.from("tasks").update({ completed }).eq("id", id);
};  