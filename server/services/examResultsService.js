// server/services/examResultsService.js
const supabase = require("./supabaseClient");

// Tüm sonuçları getir
exports.getAllResults = async () =>
  await supabase.from("exam_results").select("*");

// Belirli öğrenciye ait sonuçları getir
exports.getResultsByStudentId = async (studentId) =>
  await supabase
    .from("exam_results")
    .select("*")
    .eq("student_id", studentId);

// Yeni sonuç ekle
exports.createResult = async (result) =>
  await supabase
    .from("exam_results")
    .insert([result])
    .select();

// Delete existing topic mistakes for a specific exam and lesson
exports.deleteTopicMistakes = async (examId, lesson) => {
  return await supabase
    .from("exam_topic_mistakes")
    .delete()
    .match({ exam_id: examId, lesson });
};

// Save new topic mistakes
exports.saveTopicMistakes = async (topicMistakesArray) => {
  return await supabase
    .from("exam_topic_mistakes")
    .insert(topicMistakesArray)
    .select();
};

// Get topic mistakes for a specific exam
exports.getTopicMistakesByExamId = async (examId) => {
  return await supabase
    .from("exam_topic_mistakes")
    .select("*")
    .eq("exam_id", examId);
};

// Get topic mistakes for a student across all exams
exports.getTopicMistakesByStudentId = async (studentId) => {
  // This assumes exam_topic_mistakes can be joined to exams through exam_id
  // and exams can be joined to students through student_id
  return await supabase
    .from("exam_topic_mistakes")
    .select(`
      *,
      exams:exam_id(
        student_id,
        date
      )
    `)
    .eq("exams.student_id", studentId);
};

// Get aggregated topic mistakes summary for a student (useful for analysis)
exports.getTopicMistakesSummaryByStudentId = async (studentId) => {
  // For databases that support it, you might use a more efficient query with GROUP BY
  // Here we'll fetch all data and aggregate in application code
  const { data, error } = await exports.getTopicMistakesByStudentId(studentId);
  
  if (error) return { error };
  
  // Aggregate mistakes by topic
  const summary = {};
  
  data.forEach(item => {
    const topic = item.topic;
    if (!summary[topic]) {
      summary[topic] = {
        total_mistakes: 0,
        occurrences: 0,
        lessons: new Set()
      };
    }
    
    summary[topic].total_mistakes += item.mistake_count;
    summary[topic].occurrences += 1;
    summary[topic].lessons.add(item.lesson);
  });
  
  // Convert to array and sort by total mistakes
  const result = Object.entries(summary).map(([topic, stats]) => ({
    topic,
    total_mistakes: stats.total_mistakes,
    occurrences: stats.occurrences,
    average_per_occurrence: stats.total_mistakes / stats.occurrences,
    lessons: Array.from(stats.lessons)
  })).sort((a, b) => b.total_mistakes - a.total_mistakes);
  
  return { data: result };
};
