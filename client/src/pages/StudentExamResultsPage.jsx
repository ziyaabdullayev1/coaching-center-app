// src/pages/StudentExamResultsPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchAssignmentsForStudentByEmail } from "../services/examAssignmentRequests";
import "./StudentExamResultsPage.css";

export default function StudentExamResultsPage() {
  const { user } = useAuth();
  const [exams, setExams]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState();

  useEffect(() => {
    const load = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const assignments = await fetchAssignmentsForStudentByEmail(user.email);
        const examsList = assignments.flatMap(a => {
          if (!Array.isArray(a.exams)) return [];
          return a.exams.map(r => ({
            id:            r.id,
            assignment_id: r.assignment_id,
            lesson:        r.lesson,
            correct:       r.correct,
            wrong:         r.wrong,
            blank:         r.blank,
            date:          a.exam_templates?.date,
            feedback:      a.feedback || ""
          }));
        });
        setExams(examsList);
      } catch (e) {
        setError(e.message || "Sunucu hatası");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <p className="status-message">⏳ Yükleniyor...</p>;
  if (error)   return <p className="status-message error">Hata: {error}</p>;
  if (!exams.length) return <p className="status-message">Henüz sınav sonucu yok.</p>;

  return (
    <div className="results-page">
      <h2 className="page-title">📊 Sınav Sonuçlarım & Öneriler</h2>
      {exams.map(ex => {
        const total     = ex.correct + ex.wrong + ex.blank;
        const ratio     = total > 0 ? ex.correct / total : 0;
        const pct       = (ratio * 100).toFixed(1);
        const needsWork = ratio < 0.7;
        return (
          <div className="exam-card" key={`${ex.assignment_id}-${ex.lesson}`}>
            <div className="exam-header">
              <span className="exam-date">{ex.date ? new Date(ex.date).toLocaleDateString() : "—"}</span>
              <span className="exam-lesson">{ex.lesson}</span>
            </div>
            <div className="exam-details">
              <div className="exam-detail">
                <strong>Doğru:</strong> {ex.correct} / {total}
              </div>
              <div className="exam-detail">
                <strong>Başarı:</strong> {pct}%
              </div>
            </div>
            {needsWork && <div className="exam-warning">❗ %70’in altında kalmışsın, tekrar çalış!</div>}
            {ex.feedback && (
              <div className="exam-feedback">
                <span className="feedback-title">📝 Öğretmen Yorumu:</span>
                <p className="feedback-text">{ex.feedback}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
