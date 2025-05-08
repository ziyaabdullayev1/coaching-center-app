const examService = require("../services/examService");

// GET /api/exams
exports.getExams = async (req, res) => {
  const { data, error } = await examService.getAllExams();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/exams  ← artık birden fazla satır bekleniyor
exports.addExam = async (req, res) => {
  const exams = req.body; // [{ student_id,date,lesson,correct,wrong,blank}, …]
  const { data, error } = await examService.createExam(exams);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/exams/:id
exports.updateExam = async (req, res) => {
  const { id } = req.params;
  const updatedExam = req.body;
  const { data, error } = await examService.updateExam(id, updatedExam);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/exams/:id
exports.deleteExam = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await examService.deleteExam(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Exam deleted successfully", data });
};

// GET /api/exams/student/:student_id
exports.getExamsByStudent = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await examService.getExamsByStudentId(student_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// (Zaten eklemiştin:)
exports.getExamSummary = async (req, res) => {
  const { student_id } = req.params;
  const result = await examService.getExamSummaryByStudent(student_id);
  if (result.error) return res.status(500).json({ error: result.error.message });
  res.json(result.summary);
};

exports.getAverageByLesson = async (req, res) => {
  const { student_id } = req.params;
  const result = await examService.getAverageByLesson(student_id);
  if (result.error) return res.status(500).json({ error: result.error.message });
  res.json(result.data);
};

exports.getProgress = async (req, res) => {
  const { student_id } = req.params;
  const result = await examService.getProgressOverTime(student_id);
  if (result.error) return res.status(500).json({ error: result.error.message });
  res.json(result.data);
};

exports.addExam = async (req, res) => {
  const { assignment_id, student_id, date, lesson, correct, wrong, blank } = req.body;

  if (!assignment_id) {
    return res.status(400).json({ error: "assignment_id is required" });
  }

  const { data, error } = await examService.createExam({ assignment_id, student_id, date, lesson, correct, wrong, blank });
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

exports.getResultsByTeacher = async (req, res) => {
  const { teacher_id } = req.params;
  const { data, error } = await examService.getResultsByTeacherId(teacher_id);

  if (error) {
    console.error("❌ getResultsByTeacherId failed:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
};