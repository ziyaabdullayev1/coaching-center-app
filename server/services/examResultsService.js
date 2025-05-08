// server/services/examResultsService.js
const supabase = require("./supabaseClient");

// Tüm sonuçları getir
exports.getAllResults = async () =>
  await supabase.from("exam_results").select("*");

// Belirli öğrenciye ait sonuçları getir
exports.getResultsByStudentId = async (studentId) =>
  await supabase
    .from("exam_results")
    .select("*")
    .eq("student_id", studentId);

// Yeni sonuç ekle
exports.createResult = async (result) =>
  await supabase
    .from("exam_results")
    .insert([result])
    .select();
