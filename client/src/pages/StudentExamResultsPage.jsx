// src/pages/StudentExamResultsPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchExamsByStudentId } from "../services/requests";

export default function StudentExamResultsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      const studentId = user.user_metadata?.student_id || user.id;
      const data = await fetchExamsByStudentId(studentId);
      setExams(data);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <p>⏳ Yükleniyor...</p>;
  if (!exams.length) return <p>Henüz sınav sonucu yok.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>📊 Sınav Sonuçlarım & Öneriler</h2>
      {exams.map((ex) => {
        const total = ex.correct + ex.wrong + ex.blank;
        const ratio = total > 0 ? ex.correct / total : 0;
        const pct = (ratio * 100).toFixed(1);
        const needsWork = ratio < 0.7;
        return (
          <div
            key={`${ex.id}-${ex.lesson}`}
            style={{
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "1rem",
              background: needsWork ? "#fee2e2" : "#e6fffa",
            }}
          >
            <p>
              <b>Tarih:</b> {new Date(ex.date).toLocaleDateString()}
            </p>
            <p>
              <b>Ders:</b> {ex.lesson}
            </p>
            <p>
              <b>Doğru:</b> {ex.correct} / {total} ({pct}%)
            </p>
            {needsWork && (
              <p style={{ color: "#c53030" }}>
                ❗ %70’in altında kalmışsın, tekrar çalış!
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
