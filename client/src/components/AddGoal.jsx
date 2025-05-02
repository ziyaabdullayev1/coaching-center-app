import { useEffect, useState } from "react";
import { fetchStudents, createGoal } from "../services/requests";

export default function AddGoal({ onGoalAdded }) {
  const [lesson, setLesson] = useState("");
  const [target, setTarget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [studentId, setStudentId] = useState("");
  const [students, setStudents] = useState([]);

  // console.log("AddGoal component çalıştı!")
  
  useEffect(() => {
    const loadStudents = async () => {
      const data = await fetchStudents();
      console.log("Öğrenciler:", data);  // 🔥 buraya dikkat
      setStudents(data || []);
    };
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!studentId) {
      alert("Please select a student.");
      return;
    }
  
    const newGoal = {
      lesson,
      total_questions: Number(target), // 🔄 burada değişiklik yaptık
      start_date: startDate,
      end_date: endDate,
      student_id: studentId,
    };
    
  
    // 🔍 LOG EKLENDİ: Payload kontrolü
    console.log("📤 createGoal payload:", newGoal);
  
    // 🔍 LOG EKLENDİ: Tip kontrolü
    console.log("🧪 Kontrol: target =", Number(target), "| isNaN:", isNaN(Number(target)));
  
    const created = await createGoal(newGoal);
  
    // 🔍 LOG EKLENDİ: Response
    console.log("✅ Backend yanıtı:", created);
  
    if (created) {
      onGoalAdded?.();
      setLesson("");
      setTarget("");
      setStartDate("");
      setEndDate("");
      setStudentId("");
    } else {
      alert("Goal eklenemedi. Lütfen loglara bak.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} ({student.email})
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Lesson (e.g., Math)"
        value={lesson}
        onChange={(e) => setLesson(e.target.value)}
        required
      />
      <input
  type="number"
  placeholder="Total Questions (e.g., 70)"
  value={target}
  onChange={(e) => setTarget(e.target.value)}
  required
/>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />

      <button type="submit">Save Goal</button>
    </form>
  );
}
