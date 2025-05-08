// server/services/examService.js
const supabase = require("./supabaseClient");


exports.getResultsByTeacherId = async (teacherId) => {
    // 1️⃣ Fetch all templates this teacher has defined
    const { data: templates, error: tplErr } = await supabase
      .from("exam_templates")
      .select("id, name, date")
      .eq("teacher_id", teacherId);
  
    if (tplErr) return { data: null, error: tplErr };
  
    const templateIds = templates.map((t) => t.id);
    if (templateIds.length === 0) return { data: [], error: null };
  
    // 2️⃣ Fetch all assignments of those templates, including template metadata & lessons
    const { data: assignments, error: asnErr } = await supabase
      .from("exam_assignment")
      .select(`
        id,
        student_id,
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
      `)
      .in("template_id", templateIds);
  
    if (asnErr) return { data: null, error: asnErr };
  
    // 3️⃣ Fetch all student‐entered exam records
    //    You said you’re reusing your `exams` table as results, so:
    const studentIds = [...new Set(assignments.map((a) => a.student_id))];
    const { data: examEntries, error: exErr } = await supabase
      .from("exams")
      .select("id, student_id, date, lesson, correct, wrong, blank")
      .in("student_id", studentIds);
  
    if (exErr) return { data: null, error: exErr };
  
    // 4️⃣ Merge them:
    const results = assignments.map((a) => {
      const tpl = a.exam_templates;
      return {
        assignment_id: a.id,
        student_id: a.student_id,
        template_id: tpl.id,
        template_name: tpl.name,
        date: tpl.date,
        lessons: tpl.exam_template_lessons.map((lessonDef) => {
          // find that student's entry for this lesson
          const entry = examEntries.find(
            (e) =>
              e.student_id === a.student_id &&
              e.date === tpl.date &&
              e.lesson === lessonDef.lesson
          );
          return {
            lesson: lessonDef.lesson,
            question_count: lessonDef.question_count,
            result: entry
              ? {
                  correct: entry.correct,
                  wrong: entry.wrong,
                  blank: entry.blank,
                }
              : null,
          };
        }),
      };
    });
  
    return { data: results, error: null };
  };