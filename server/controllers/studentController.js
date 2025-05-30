const supabase = require("../services/supabaseClient");

// Get all exams for a student by email
exports.getStudentExamsByEmail = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // First get the student
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("email", email)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Then get all their exams
    const { data: exams, error: examsError } = await supabase
      .from("exams")
      .select(`
        *,
        exam_template:exam_templates(name)
      `)
      .eq("student_id", student.id)
      .order("date", { ascending: false });

    if (examsError) {
      console.error("Error fetching student exams:", examsError);
      return res.status(500).json({ error: examsError.message });
    }

    res.json(exams || []);
  } catch (err) {
    console.error("Server error in getStudentExamsByEmail:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}; 