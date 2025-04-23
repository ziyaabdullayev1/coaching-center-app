// services/goalService.js
const supabase = require("./supabaseClient");

// Tüm hedefleri getir
exports.getAllGoals = async () => {
  return await supabase.from("goals").select("*");
};

// Yeni hedef oluştur
exports.createGoal = async (goal) => {
  return await supabase.from("goals").insert([goal]);
};

// Güncelle
exports.updateGoal = async (id, goalData) => {
    return await supabase.from("goals").update(goalData).eq("id", id);
  };
  
  // Sil
  exports.deleteGoal = async (id) => {
    return await supabase.from("goals").delete().eq("id", id);
  };
  
  // Belirli öğrenciye ait hedefleri getir
  exports.getGoalsByStudentId = async (studentId) => {
    return await supabase.from("goals").select("*").eq("student_id", studentId);
  };