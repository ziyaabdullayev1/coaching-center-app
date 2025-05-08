// src/services/examRequests.js

// Eğer ileride .env ile çalışmak isterseniz, VITE_API_BASE_URL = "http://localhost:3001" olarak ayarlayabilirsiniz.
// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const API_BASE = "http://localhost:3001";

export async function fetchTemplatesByTeacher(teacherId) {
  try {
    const res = await fetch(`${API_BASE}/api/exam-templates/teacher/${teacherId}`);
    if (!res.ok) {
      console.error("❌ Şablonları çekerken hata:", await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching templates:", err);
    return [];
  }
}

export async function createExamTemplate(template) {
  try {
    const res = await fetch(`${API_BASE}/api/exam-templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Şablon oluşturma hatası:", errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error in createExamTemplate:", err);
    return false;
  }
}

export async function fetchExamsByStudent(studentId) {
  try {
    const res = await fetch(`${API_BASE}/api/exams/student/${studentId}`);
    if (!res.ok) {
      console.error("❌ Sınav sonuçlarını çekerken hata:", await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching exams:", err);
    return [];
  }
}

export async function createExams(resultsArray) {
  try {
    const res = await fetch(`${API_BASE}/api/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultsArray),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Sonuç ekleme hatası:", errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error in createExams:", err);
    return false;
  }
}

export async function fetchExamSummary(studentId) {
  try {
    const res = await fetch(`${API_BASE}/api/exams/student/${studentId}/summary`);
    if (!res.ok) {
      console.error("❌ Özet verisi çekerken hata:", await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching exam summary:", err);
    return null;
  }
}

export async function fetchAverageByLesson(studentId) {
  try {
    const res = await fetch(`${API_BASE}/api/exams/student/${studentId}/average`);
    if (!res.ok) {
      console.error("❌ Ders ortalaması çekerken hata:", await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching average by lesson:", err);
    return [];
  }
}

export async function fetchProgress(studentId) {
  try {
    const res = await fetch(`${API_BASE}/api/exams/student/${studentId}/progress`);
    if (!res.ok) {
      console.error("❌ Gelişim verisi çekerken hata:", await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching progress over time:", err);
    return [];
  }
}
