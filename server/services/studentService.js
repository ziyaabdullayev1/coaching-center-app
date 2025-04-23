// services/studentService.js
const supabase = require("./supabaseClient");

// Tüm öğrencileri getir
exports.getAllStudents = async () => {
  return await supabase.from("students").select("*");
};

// Yeni öğrenci ekle (ileri kullanım için)
exports.createStudent = async (student) => {
  return await supabase.from("students").insert([student]);
};

// Öğrenciyi güncelle
exports.updateStudent = async (id, student) => {
  return await supabase.from("students").update(student).eq("id", id);
};

// Öğrenciyi sil
exports.deleteStudent = async (id) => {
  return await supabase.from("students").delete().eq("id", id);
};
