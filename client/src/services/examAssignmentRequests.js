//client/src/services/examAssignmentRequests.js
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
  return res.ok ? res.json() : Promise.reject(await res.text());
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

 export async function createExamResult(result) {
  try {
    const res = await fetch(`${API}/api/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error("createExamResult failed:", err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("createExamResult thrown:", e);
    return false;
  }
}
  
export async function fetchAssignmentsForTeacher(teacherId) {
  const res = await fetch(`http://localhost:3001/api/exam-assignments/teacher/${teacherId}/results`)
  if (!res.ok) {
    console.error("fetchAssignmentsForTeacher failed:", await res.text())
    return []
  }
  const data = await res.json()
  return data
}

  
export async function submitExamResults({ assignment_id, lesson_results }) {
  const res = await fetch(`${API}/exam-assignments/${assignment_id}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_results }),
  });
  if (!res.ok) {
    console.error("submitExamResults failed:", await res.text());
    return false;
  }
  return true;
}

export async function updateAssignmentFeedback(assignmentId, comment) {
  const res = await fetch(
    `${API}/api/exam-assignments/${assignmentId}/feedback`,  // ← now correct
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    }
  );
  if (!res.ok) {
    console.error("updateAssignmentFeedback failed:", await res.text());
    return false;
  }
  return true;
}

export async function fetchAssignmentsForStudentByEmail(email) {
  const url = `/api/exam-assignments/student?email=${encodeURIComponent(email)}`;
  console.log("[examAssignmentRequests] fetching:", url);

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error("fetchAssignmentsForStudentByEmail failed:", res.status, text);
    return [];
  }
  return res.json();
}