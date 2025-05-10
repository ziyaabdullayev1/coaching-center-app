// server/controllers/examAssignmentsController.js
const assignmentService = require("../services/examAssignmentService");
const supabase           = require("../services/supabaseClient");


// POST   /api/exam-assignments
exports.assignTemplate = async (req, res) => {
  const {
    template_id,
    student_ids = [],    // preferred key
    students = [],       // fallback key
    grade
  } = req.body;

  // 1) Merge any incoming IDs
  let ids = Array.isArray(student_ids) && student_ids.length
    ? student_ids
    : Array.isArray(students) && students.length
      ? students
      : [];

  // 2) If still empty but grade was given, lookup all students in that grade
  if (ids.length === 0 && grade) {
    const { data: studs, error: studErr } = await supabase
      .from("students")
      .select("id")
      .eq("grade", grade);
    if (studErr) {
      console.error("Supabase error fetching grade:", studErr);
      return res.status(500).json({ error: studErr.message });
    }
    ids = studs.map((s) => s.id);
  }

  // 3) Validate
  if (!template_id || ids.length === 0) {
    return res
      .status(400)
      .json({
        error:
          "template_id ve en az bir student_id (veya grade) zorunludur."
      });
  }

  // 4) Perform the assignments
  const { data, error } = await assignmentService.assignToStudents(
    template_id,
    ids
  );
  if (error) {
    console.error("Assignment error:", error);
    return res.status(500).json({ error: error.message });
  }

  // 5) Return the inserted rows
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
  const { data, error } = await assignmentService.getResultsByTeacherId(teacherId);
  if (error) {
    console.error("💥 getResultsByTeacherId error:", error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
};


// server/controllers/examAssignmentsController.js
exports.getAssignmentsForStudent = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await assignmentService.getAssignmentsForStudent(student_id);
  if (error) return res.status(500).json({ error: error.message });

  // 🔍 DEBUG LOG
  console.log("👉 [getAssignmentsForStudent] payload for", student_id, ":\n", JSON.stringify(data, null, 2));

  res.json(data);
};


// server/controllers/examAssignmentsController.js
exports.getAssignmentsForTeacher = async (req, res) => {
  const teacherId = req.params.teacher_id;
  const { data, error } = await assignmentService.getAssignmentsForTeacher(
    teacherId
  );
  if (error) return res.status(500).json({ error: error.message });
  console.log("👉 [getAssignmentsForTeacher] for", teacherId, data);
  res.json(data);
};


exports.addAssignmentFeedback = async (req, res) => {
  const assignmentId = req.params.id;
  const { comment }   = req.body;

  if (!comment?.trim()) {
    return res.status(400).json({ error: "Yorum boş olamaz." });
  }

  const { error } = await assignmentService.updateAssignmentFeedback(
    assignmentId,
    comment
  );
  if (error) {
    console.error("Feedback güncelleme hatası:", error);
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ success: true });
};


exports.getAssignmentsForStudentByEmail = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "email query param is required" });
  }
  console.log("→ [Controller] lookup student by email:", email);

  // 1) Find the student.id for that email
  const { data: student, error: studErr } = await supabase
    .from("students")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (studErr) {
    console.error("→ [Controller] student lookup error:", studErr);
    return res.status(500).json({ error: studErr.message });
  }
  if (!student) {
    console.warn("→ [Controller] no students row for email:", email);
    return res.status(404).json({ error: "No student record found" });
  }

  console.log("→ [Controller] mapped to student_id:", student.id);

  // 2) Fetch assignments exactly as before
  const { data, error } = await assignmentService.getAssignmentsForStudent(
    student.id
  );
  if (error) {
    console.error("→ [Controller] getAssignmentsForStudent error:", error);
    return res.status(500).json({ error: error.message });
  }

  console.log("→ [Controller] returning assignments:", data);
  res.json(data);
};