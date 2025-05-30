// routes/students.js
const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentsController");
const supabase = require("../services/supabaseClient");

// Get student exams by email
router.get("/email/:email/exams", async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    console.log('Fetching exams for student email:', email);
    // First get the student
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("email", email)
      .single();

    if (studentError || !student) {
      console.error('Student not found:', studentError);
      return res.status(404).json({ error: "Student not found" });
    }

    console.log('Found student:', student);

    // Then get all their exams
    const { data: exams, error: examsError } = await supabase
      .from("exams")
      .select("*")
      .eq("student_id", student.id)
      .order("date", { ascending: false });

    if (examsError) {
      console.error("Error fetching student exams:", examsError);
      return res.status(500).json({ error: examsError.message });
    }

    console.log('Found exams:', exams);

    // If we need exam template names, we can fetch them separately
    if (exams && exams.length > 0) {
      const templateIds = [...new Set(exams.map(exam => exam.template_id))];
      const { data: templates, error: templatesError } = await supabase
        .from("exam_templates")
        .select("id, name")
        .in("id", templateIds);

      if (!templatesError && templates) {
        const templateMap = templates.reduce((acc, t) => {
          acc[t.id] = t.name;
          return acc;
        }, {});

        // Add template names to exams
        exams.forEach(exam => {
          exam.template_name = templateMap[exam.template_id] || "Unnamed Exam";
        });
      }
    }

    res.json(exams || []);
  } catch (err) {
    console.error("Server error in getStudentExamsByEmail:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Other routes
router.get("/", studentsController.getStudents);
router.post("/", studentsController.addStudent);
router.put("/:id", studentsController.updateStudent);     // PUT
router.delete("/:id", studentsController.deleteStudent); // DELETE
router.get("/email/:email", studentsController.getStudentByEmail);

module.exports = router;
