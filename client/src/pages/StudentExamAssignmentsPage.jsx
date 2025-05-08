import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchAssignmentsForStudent } from "../services/examAssignmentRequests";
import { createExams } from "../services/examRequests";

export default function StudentExamAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchAssignmentsForStudent(user.id).then(setAssignments);
  }, [user]);

  const handleSubmit = async (assignment, results) => {
    // results = [{lesson, correct, wrong, blank}, ...]
    const payload = results.map(r => ({
      student_id: user.id,
      date: assignment.exam_templates.date,
      lesson: r.lesson,
      correct: r.correct,
      wrong: r.wrong,
      blank: r.blank,
    }));
    const ok = await createExams(payload);
    if (ok) alert("Sonuç kaydedildi!");
  };

  return (
    <div>
      <h2>📚 Atanan Sınavlar</h2>
      {assignments.map(a => (
        <ExamAssignmentCard
          key={a.id}
          assignment={a}
          onSubmit={handleSubmit}
        />
      ))}
    </div>
  );
}
