const supabase = require("../services/supabaseClient");

// GET /api/teachers
exports.getTeachers = async (req, res) => {
  const { data, error } = await supabase.from("teachers").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/teachers
exports.addTeacher = async (req, res) => {
  const teacher = req.body;
  const { data, error } = await supabase.from("teachers").insert([teacher]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/teachers/:id
exports.updateTeacher = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const { data, error } = await supabase.from("teachers").update(updatedData).eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/teachers/:id
exports.deleteTeacher = async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Teacher deleted successfully", data });
};

// GET /api/teachers/email/:email
exports.getTeacherByEmail = async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("❌ Supabase teacher fetch error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

// GET /api/teachers/:id/students
exports.getTeacherStudents = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    console.error("❌ Missing teacher ID in request");
    return res.status(400).json({ error: "Missing teacher ID parameter" });
  }

  console.log(`🔍 Fetching students for teacher ID: ${id}`);
  
  try {
    // Get all unique students who have been assigned exams by this teacher
    const { data, error } = await supabase
      .from('exam_assignments')
      .select(`
        student_id,
        students (
          id,
          name,
          email,
          grade
        ),
        exam_templates!inner (
          id,
          teacher_id
        )
      `)
      .eq('exam_templates.teacher_id', id);

    if (error) {
      console.error("❌ Error fetching teacher's students:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.log(`✅ No students found for teacher ID: ${id}`);
      return res.json([]);
    }

    // Transform the data to get unique students
    const uniqueStudents = Array.from(
      new Map(
        data
          .filter(item => item.students) // Filter out any null students
          .map(item => [item.students.id, item.students]) // Use student ID as key
      ).values()
    );

    console.log(`✅ Found ${uniqueStudents.length} students for teacher ID: ${id}`);
    return res.json(uniqueStudents);
    
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error fetching students" });
  }
};
