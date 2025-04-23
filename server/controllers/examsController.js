const examService = require("../services/examService");

// GET /api/exams
exports.getExams = async (req, res) => {
  const { data, error } = await examService.getAllExams();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/exams
exports.addExam = async (req, res) => {
  const exam = req.body;
  const { data, error } = await examService.createExam(exam);
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