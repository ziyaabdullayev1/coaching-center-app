const supabase = require("./supabaseClient");

// Tüm sınavları getir
exports.getAllExams = async () => {
  return await supabase.from("exams").select("*");
};

// Yeni sınav ekle
exports.createExam = async (exam) => {
  return await supabase.from("exams").insert([exam]);
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

// Net hesapla: doğru - (yanlış / 3)
exports.getExamSummaryByStudent = async (studentId) => {
    const { data, error } = await supabase.from("exams").select("*").eq("student_id", studentId);
    if (error) return { error };
  
    let totalCorrect = 0, totalWrong = 0, totalBlank = 0;
  
    data.forEach((exam) => {
      totalCorrect += exam.correct;
      totalWrong += exam.wrong;
      totalBlank += exam.blank;
    });
  
    const net = totalCorrect - totalWrong / 3;
  
    return {
      summary: {
        correct: totalCorrect,
        wrong: totalWrong,
        blank: totalBlank,
        net: Number(net.toFixed(2))
      }
    };
  };
  
  // Ders bazlı ortalama doğru
  exports.getAverageByLesson = async (studentId) => {
    const { data, error } = await supabase.from("exams").select("*").eq("student_id", studentId);
    if (error) return { error };
  
    const lessonStats = {};
    data.forEach((exam) => {
      if (!lessonStats[exam.lesson]) {
        lessonStats[exam.lesson] = { totalCorrect: 0, count: 0 };
      }
      lessonStats[exam.lesson].totalCorrect += exam.correct;
      lessonStats[exam.lesson].count += 1;
    });
  
    const averages = Object.entries(lessonStats).map(([lesson, stat]) => ({
      lesson,
      averageCorrect: Number((stat.totalCorrect / stat.count).toFixed(2))
    }));
  
    return { data: averages };
  };
  
  // Gelişim verisi (tarih + net)
  exports.getProgressOverTime = async (studentId) => {
    const { data, error } = await supabase.from("exams").select("*").eq("student_id", studentId).order("date", { ascending: true });
    if (error) return { error };
  
    const progress = data.map((exam) => ({
      date: exam.date,
      net: Number((exam.correct - exam.wrong / 3).toFixed(2))
    }));
  
    return { data: progress };
  };