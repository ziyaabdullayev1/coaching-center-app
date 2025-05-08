// server/services/examAssignmentService.js
const supabase = require("./supabaseClient");

exports.assignToStudents = async (templateId, studentIds) => {
  const rows = studentIds.map((sid) => ({
    template_id: templateId,
    student_id: sid,
  }));
  return await supabase.from("exam_assignments").insert(rows);
};

exports.getAssignmentsForStudent = async (studentId) => {
  return await supabase
    .from("exam_assignments")
    .select(
      `
      id,
      assigned_at,
      exam_templates (
        id,
        name,
        date,
        exam_template_lessons (
          id,
          lesson,
          question_count
        )
      )
    `
    )
    .eq("student_id", studentId)
    .order("assigned_at", { ascending: false });
};

// server/services/examAssignmentService.js
exports.getResultsByTeacherId = async (teacherId) => {
    const { data, error } = await supabase
      .from("exam_assignments")
      .select(`
        id,
        student_id,
        assigned_at,
        exam_templates (
          id,
          teacher_id,
          name,
          date
        ),
        exams (          -- burası assignment→exams ilişkisi adı
          id,
          lesson,
          correct,
          wrong,
          blank
        )
      `)
      .eq("exam_templates.teacher_id", teacherId);
  
    if (error) return { error };
    return { data };
  };
  