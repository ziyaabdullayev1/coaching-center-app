const supabase = require("../services/supabaseClient"); 

// controllers/studentsController.js
const studentService = require("../services/studentService");

// GET /api/students
exports.getStudents = async (req, res) => {
  const { data, error } = await studentService.getAllStudents();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/students (isteğe bağlı, hazır)
exports.addStudent = async (req, res) => {
  const student = req.body;
  const { data, error } = await studentService.createStudent(student);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  const { data, error } = await studentService.updateStudent(id, updatedData);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  const id = req.params.id;

  const { data, error } = await studentService.deleteStudent(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Student deleted successfully", data });
};

// GET /api/students/email/:email
exports.getStudentByEmail = async (req, res) => {
  const { email } = req.params;

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("email", email)
    .maybeSingle(); // 🔄 değiştirildi

  if (error) {
    console.error("❌ Supabase error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    console.warn(`🔍 Öğrenci bulunamadı: ${email}`);
    return res.status(404).json({ error: "Student not found" });
  }

  res.json(data);
};

