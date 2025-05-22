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
    // First, let's try to get students from a relationship table
    // This assumes there might be a teacher_student or student_teacher junction table
    let { data: relationData, error: relationError } = await supabase
      .from("teacher_student")
      .select("student_id")
      .eq("teacher_id", id);
      
    if (relationError && relationError.code === '42P01') {
      // Table doesn't exist, try another name
      console.log("Trying student_teacher table instead...");
      relationData = null;
      relationError = null;
      
      const result = await supabase
        .from("student_teacher")
        .select("student_id")
        .eq("teacher_id", id);
        
      relationData = result.data;
      relationError = result.error;
    }
    
    if (relationError) {
      console.error("❌ Error fetching teacher-student relations:", relationError);
      
      // If no relationship table, let's try direct lookup in students table
      // Try different possible column names
      console.log("Trying direct lookup in students table...");
      
      const possibleColumns = ["teacher_id", "teacher", "coach_id", "coach"];
      let studentsData = null;
      let studentsError = null;
      
      for (const column of possibleColumns) {
        console.log(`Trying column: ${column}`);
        const result = await supabase
          .from("students")
          .select("id, name, email, grade")
          .eq(column, id);
          
        if (!result.error) {
          studentsData = result.data;
          break;
        } else {
          studentsError = result.error;
        }
      }
      
      if (studentsData) {
        console.log(`✅ Found ${studentsData.length} students for teacher ID: ${id}`);
        return res.json(studentsData);
      } else {
        // As a last resort, return all students
        console.log("No direct relation found. Returning all students");
        const { data: allStudents, error: allStudentsError } = await supabase
          .from("students")
          .select("id, name, email, grade");
          
        if (allStudentsError) {
          console.error("❌ Error fetching all students:", allStudentsError);
          return res.status(500).json({ error: allStudentsError.message });
        }
        
        return res.json(allStudents || []);
      }
    } else if (relationData && relationData.length > 0) {
      // Get the student IDs from the relation table
      const studentIds = relationData.map(rel => rel.student_id);
      
      // Then fetch the actual student data
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("id, name, email, grade")
        .in("id", studentIds);
        
      if (studentsError) {
        console.error("❌ Error fetching students by IDs:", studentsError);
        return res.status(500).json({ error: studentsError.message });
      }
      
      console.log(`✅ Found ${studentsData.length} students for teacher ID: ${id}`);
      return res.json(studentsData || []);
    } else {
      // No relations found
      console.log(`✅ No students found for teacher ID: ${id}`);
      return res.json([]);
    }
    
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error fetching students" });
  }
};
