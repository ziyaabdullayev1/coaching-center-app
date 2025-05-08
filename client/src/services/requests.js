export async function createGoal(goalData) {
  try {
    const res = await fetch("http://localhost:3001/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goalData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ createGoal API error:", data); // 🔥 Hata detayını gör
      return null;
    }

    return data;
  } catch (err) {
    console.error("❌ Network error while creating goal:", err);
    return null;
  }
}


  
  export async function fetchStudents() {
    try {
      const res = await fetch("http://localhost:3001/api/students");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching students:", err);
      return [];
    }
  }
  

  export async function fetchTasksByStudentId(studentId) {
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/student/${studentId}`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return [];
    }
  }
  
  export async function updateTaskStatus(taskId, completed) {
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      return res.ok;
    } catch (err) {
      console.error("Error updating task:", err);
      return false;
    }
  }
  
  export async function createTask(taskData) {
    try {
      const res = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("❌ createTask API error:", data); // ← BUNU EKLE
        return null;
      }
  
      return data;
    } catch (err) {
      console.error("Error creating task:", err);
      return null;
    }
  }

  export async function fetchGoalsByStudentId(studentId) {
    try {
      const res = await fetch(`http://localhost:3001/api/goals/student/${studentId}`);
      const data = await res.json();
  
      if (!res.ok) {
        console.error("❌ API error:", data);
        return [];
      }
  
      return data;
    } catch (err) {
      console.error("❌ Network error while fetching goals:", err);
      return [];
    }
  }
  
  
  export async function fetchTasksByGoalId(goalId) {
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/goal/${goalId}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching tasks by goal:", err);
      return [];
    }
  }
  
  export async function createExams(exams) {
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exams),
      });
      return await res.json();
    } catch (err) {
      console.error("Error creating exams:", err);
      return null;
    }
  }
  
  // 🆕 Öğrenciye ait sınav sonuçlarını getir
  export async function fetchExamsByStudentId(studentId) {
    try {
      const res = await fetch(`/api/exams/student/${studentId}`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching exams:", err);
      return [];
    }
  }


  