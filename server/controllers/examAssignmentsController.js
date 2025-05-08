// server/controllers/examAssignmentsController.js
const assignmentService = require("../services/examAssignmentService");

// POST   /api/exam-assignments
exports.assignTemplate = async (req, res) => {
  const { template_id, student_ids } = req.body;
  const { data, error } = await assignmentService.assignToStudents(
    template_id,
    student_ids
  );
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// GET    /api/exam-assignments/student/:student_id
exports.getAssignmentsForStudent = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await assignmentService.getAssignmentsForStudent(
    student_id
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET    /api/exam-assignments/teacher/:teacher_id/results
exports.getResultsByTeacher = async (req, res) => {
    const teacherId = req.params.teacher_id;
    const { data, error } = await examAssignmentService.getResultsByTeacherId(teacherId);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  };
