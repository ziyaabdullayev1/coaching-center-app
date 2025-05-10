// server/services/examAssignmentService.js
const supabase = require("./supabaseClient");

// Insert one assignment row per student
exports.assignToStudents = async (templateId, studentIds) => {
  const rows = studentIds.map(sid => ({
    template_id: templateId,
    student_id: sid,
  }));
  return await supabase.from("exam_assignments").insert(rows);
};


exports.assignToStudents = async (templateId, studentIds) => {
  const rows = studentIds.map(sid => ({
    template_id: templateId,
    student_id: sid,
  }));
  return await supabase.from("exam_assignments").insert(rows);
};

// Pull assignments for a student, including nested template & lessons
exports.getAssignmentsForStudent = async (studentId) => {
  const { data, error } = await supabase
    .from("exam_assignments")
    .select(`
      id,
      student_id,
      assigned_at,
      feedback,
      exam_templates (
        id,
        name,
        date,
        exam_template_lessons (
          id,
          lesson,
          question_count
        )
      ),
      exams (
        id,
        assignment_id,
        lesson,
        correct,
        wrong,
        blank
      )
    `)
    .eq("student_id", studentId)
    .order("assigned_at", { ascending: false });
  if (error) return { error };
  return { data };
};


// Pull every assignment for a teacher and join in any exam results
exports.getResultsByTeacherId = async (teacherId) => {
  // note: no inline comments in the select string!
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
        date,
        exam_template_lessons (
          id,
          lesson,
          question_count
        )
      ),
      exams (
        id,
        assignment_id,
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

// exports.getAssignmentsForTeacher = async (teacherId) => {
//   return await supabase
//     .from("exam_assignments")
//     .select(`
//       id,
//       student_id,
//       assigned_at,
//       exam_templates (
//         id,
//         name,
//         date,
//         exam_template_lessons (
//           id,
//           lesson,
//           question_count
//         )
//       )
//     `)
//     .eq("exam_templates.teacher_id", teacherId)
//     .order("assigned_at", { ascending: false });
// };

exports.updateAssignmentFeedback = async (assignmentId, comment) => {
  const { data, error } = await supabase
    .from("exam_assignments")
    .update({ feedback: comment })
    .match({ id: assignmentId });
  return { data, error };
};