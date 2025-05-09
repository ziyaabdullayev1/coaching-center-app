// src/components/ReviewExamResults.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./AddExamResult.css";

export default function ReviewExamResults() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState();

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/exam-assignments/teacher/${user.id}/results`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setAssignments)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>🔄 Yükleniyor…</p>;
  if (error)   return <p className="error">Hata: {error}</p>;

  const valid = assignments.filter(a => a.exam_templates?.name);
  if (!valid.length)
    return <p>📭 Henüz atanmış veya çözülmüş sınav yok.</p>;

  return (
    <div className="results-container">
      {valid.map(a => {
        const tpl     = a.exam_templates;
        const lessons = tpl.exam_template_lessons || [];
        const results = a.exams || [];

        return (
          <div className="result-card" key={a.id}>
            <div className="result-header">
              <h3 className="exam-name">{tpl.name}</h3>
              <time className="exam-date">
                {tpl.date ? new Date(tpl.date).toLocaleDateString() : "—"}
              </time>
            </div>
            <div className="student-id">
              Öğrenci ID: <code>{a.student_id}</code>
            </div>
            <p className="scoring-info">
              Puanlama kuralı: Her 4 yanlış, 1 doğruyu götürür.<br/>
              Net doğru = Doğru – (Yanlış / 4)<br/>
              Puan = (Net doğru / Soru Adet) × 100
            </p>

            <div className="lesson-grid">
              {lessons.map(l => {
                const r = results.find(e => e.lesson === l.lesson) || {};
                const correct = r.correct || 0;
                const wrong   = r.wrong   || 0;
                const blank   = r.blank   || 0;

                // net doğru ve puan hesaplama
                const netCorrect = (correct - wrong / 4).toFixed(2);
                const score = l.question_count
                  ? ((netCorrect / l.question_count) * 100).toFixed(1)
                  : "0.0";

                return (
                  <div className="lesson-item" key={l.lesson}>
                    <h4 className="lesson-title">{l.lesson}</h4>
                    <div className="stats-row">
                      <span>🟢 {correct}</span>
                      <span>🔴 {wrong}</span>
                      <span>⚪ {blank}</span>
                    </div>
                    <div className="net-score">Net: {netCorrect}</div>
                    <div className="score-label">{score} puan</div>
                    <progress max="100" value={score}></progress>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
