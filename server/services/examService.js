const supabase = require("./supabaseClient");

// Tüm sınavları getir
exports.getAllExams = async () => {
  return await supabase.from("exams").select("*");
};

// Yeni sınav(lar) ekle — artık bir dizi bekliyor
// frontend’den [{…},{…},…] şeklinde gönderilen tüm satırları insert eder
exports.createExam = async (exams) => {
  // exams bir dizi mi, değilse tek bir obje ise onu da diziye sar
  const payload = Array.isArray(exams) ? exams : [exams];
  return await supabase.from("exams").insert(payload);
};

// Güncelle
exports.updateExam = async (id, examData) => {
  return await supabase.from("exams").update(examData).eq("id", id);
};

// Sil
exports.deleteExam = async (id) => {
  return await supabase.from("exams").delete().eq("id", id);
};

// Belirli öğrenciye ait sınavlar
exports.getExamsByStudentId = async (studentId) => {
  return await supabase.from("exams").select("*").eq("student_id", studentId);
};

// Özet (net, toplam doğru/yanlış/boş)
exports.getExamSummaryByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from("exams")
    .select("correct, wrong, blank")
    .eq("student_id", studentId);
  if (error) return { error };

  let totalCorrect = 0, totalWrong = 0, totalBlank = 0;
  data.forEach((row) => {
    totalCorrect += row.correct;
    totalWrong += row.wrong;
    totalBlank += row.blank;
  });

  const net = totalCorrect - totalWrong / 3;
  return {
    summary: {
      correct: totalCorrect,
      wrong: totalWrong,
      blank: totalBlank,
      net: Number(net.toFixed(2)),
    },
    error: null,
  };
};

// Ders bazlı ortalama doğru sayısı
exports.getAverageByLesson = async (studentId) => {
  const { data, error } = await supabase
    .from("exams")
    .select("lesson, correct")
    .eq("student_id", studentId);
  if (error) return { error };

  const stats = {};
  data.forEach(({ lesson, correct }) => {
    if (!stats[lesson]) stats[lesson] = { totalCorrect: 0, count: 0 };
    stats[lesson].totalCorrect += correct;
    stats[lesson].count += 1;
  });

  const dataOut = Object.entries(stats).map(([lesson, s]) => ({
    lesson,
    averageCorrect: Number((s.totalCorrect / s.count).toFixed(2)),
  }));

  return { data: dataOut, error: null };
};

// Zaman içinde gelişim (tarih + net)
exports.getProgressOverTime = async (studentId) => {
  const { data, error } = await supabase
    .from("exams")
    .select("date, correct, wrong, blank")
    .eq("student_id", studentId)
    .order("date", { ascending: true });
  if (error) return { error };

  const progress = data.map(({ date, correct, wrong, blank }) => {
    const net = correct - wrong / 3;
    return { date, net: Number(net.toFixed(2)) };
  });
  return { data: progress, error: null };
};

exports.getResultsByTeacherId = async (teacherId) => {
  const { data, error } = await supabase
    .from("exam_assignments")
    .select(`
      id,                                     -- assignment id
      student_id,
      exam_templates (
        id,
        teacher_id,
        name,
        date,
        lessons (
          id,
          lesson,
          question_count
        )
      ),
      exam_results (                          -- sınav sonuçlarınızın bulunduğu tablo
        id,
        lesson,
        correct,
        wrong,
        blank
      )
    `)
    .eq("exam_templates.teacher_id", teacherId);

  return { data, error };
};