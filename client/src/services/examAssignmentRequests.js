const API = "http://localhost:3001";

export async function assignExamTemplate(payload) {
  const res = await fetch(`${API}/api/exam-assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function fetchAssignmentsForStudent(studentId) {
    const res = await fetch(
      `http://localhost:3001/api/exam-assignments/student/${studentId}`
    );
    if (!res.ok) return [];
    return await res.json();
  }

  export async function fetchAssignedExams(studentId) {
    try {
      const res = await fetch(
        `http://localhost:3001/api/exam-assignments/student/${studentId}`
      );
      if (!res.ok) {
        console.error("❌ Assigned exams fetch failed:", res.status);
        return [];
      }
      return await res.json();
    } catch (err) {
      console.error("❌ fetchAssignedExams error:", err);
      return [];
    }
  }
  
  // öğrenci tarafından girilen sonuçları kaydeder
 // src/services/examAssignmentRequests.js

export async function createExamResult(payload) {
    try {
      const res = await fetch("http://localhost:3001/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
  
      // Eğer status 201 değilse hata çıktısını consola bas
      if (!res.ok) {
        console.error("❌ createExamResult error response:", data);
        return false;
      }
  
      // Başarılıysa dönen exam nesnesini ya da true dönebilirsin
      return true;
    } catch (err) {
      console.error("❌ createExamResult exception:", err);
      return false;
    }
  }
  

  