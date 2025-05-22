// src/components/AddExamResult.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateAssignmentFeedback } from "../services/examAssignmentRequests";
import { saveTopicMistakes } from "../services/topicMistakesRequests";
import TopicMistakesTracker from "./TopicMistakesTracker";
import "./AddExamResult.css";

export default function AddExamResult() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState();
  const [feedbackText, setFeedbackText] = useState({});
  const [submitting, setSubmitting]     = useState({});
  const [submitError, setSubmitError]   = useState({});
  const [showTopicMistakes, setShowTopicMistakes] = useState({});

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

  const handleChange = (id, text) => {
    setFeedbackText(prev => ({ ...prev, [id]: text }));
  };

  const handleSubmit = async (id) => {
    const text = feedbackText[id];
    if (!text?.trim()) return;
    setSubmitting(prev => ({ ...prev, [id]: true }));
    setSubmitError(prev => ({ ...prev, [id]: "" }));

    try {
      const ok = await updateAssignmentFeedback(id, text);
      if (!ok) throw new Error("Server error");
      setFeedbackText(prev => ({ ...prev, [id]: "" }));
    } catch (e) {
      setSubmitError(prev => ({ ...prev, [id]: e.message }));
    } finally {
      setSubmitting(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const toggleTopicMistakes = (assignmentId, lessonId) => {
    const key = `${assignmentId}-${lessonId}`;
    setShowTopicMistakes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSaveTopicMistakes = async (data) => {
    try {
      const result = await saveTopicMistakes(data);
      alert('Konu bazlı hatalar başarıyla kaydedildi');
      
      // Close the topic mistakes tracker
      const key = `${data.examId}-${data.lesson}`;
      setShowTopicMistakes(prev => ({
        ...prev,
        [key]: false
      }));
      
      return result;
    } catch (error) {
      console.error('Error saving topic mistakes:', error);
      alert(`Hata: ${error.message}`);
    }
  };

  if (loading) return <p>🔄 Yükleniyor…</p>;
  if (error)   return <p className="error">Hata: {error}</p>;

  const valid = assignments.filter(a => a.exam_templates?.name);
  if (valid.length === 0)
    return <p>📭 Henüz atanmış veya çözülmüş sınav yok.</p>;

  return (
    <div className="results-container">
      {valid.map(a => {
        const tpl     = a.exam_templates;
        const lessons = tpl.exam_template_lessons || [];
        const results = a.exams || [];
        const fid     = a.id;
        // display student name if available
        const studentName = a.student?.name || a.student_id;

        return (
          <div className="result-card" key={fid}>
            {/* Header */}
            <div className="result-header">
              <h3 className="exam-name">{tpl.name}</h3>
              <time className="exam-date">
                {tpl.date ? new Date(tpl.date).toLocaleDateString() : "—"}
              </time>
            </div>
            {/* Student Name */}
            <div className="student-name">
              Öğrenci: <strong>{studentName}</strong>
            </div>

            {/* Scoring info */}
            <p className="scoring-info">
              Puanlama kuralı: Her 4 yanlış, 1 doğruyu götürür.<br/>
              Net doğru = Doğru – (Yanlış / 4)<br/>
              Puan = (Net doğru / Soru Adet) × 100
            </p>

            {/* Lessons grid */}
            <div className="lesson-grid">
              {lessons.map(l => {
                const r = results.find(e => e.lesson === l.lesson) || {};
                const correct = r.correct || 0;
                const wrong   = r.wrong   || 0;
                const blank   = r.blank   || 0;
                const netCorrect = (correct - wrong / 4).toFixed(2);
                const score = l.question_count
                  ? ((netCorrect / l.question_count) * 100).toFixed(1)
                  : "0.0";
                  
                const hasMistakes = wrong > 0 || blank > 0;
                const trackerId = `${fid}-${l.lesson}`;
                const showTracker = showTopicMistakes[trackerId] || false;

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
                    
                    {hasMistakes && (
                      <button 
                        className="topic-mistakes-btn"
                        onClick={() => toggleTopicMistakes(fid, l.lesson)}
                      >
                        {showTracker ? "Konu Bazlı Hataları Gizle" : "Konu Bazlı Hataları Göster"}
                      </button>
                    )}
                    
                    {showTracker && hasMistakes && (
                      <TopicMistakesTracker
                        examId={r.id}
                        lesson={l.lesson}
                        totalWrong={wrong}
                        totalBlank={blank}
                        onSave={handleSaveTopicMistakes}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Feedback section */}
            <div className="feedback-section">
              <label htmlFor={`fb-${fid}`} className="feedback-label">
                Öğrenciye Yorum:
              </label>
              <textarea
                id={`fb-${fid}`}
                className="feedback-input"
                rows={3}
                placeholder="Sınav hakkında geri bildiriminizi yazın..."
                value={feedbackText[fid] || a.feedback || ""}
                onChange={e => handleChange(fid, e.target.value)}
              />
              {submitError[fid] && (
                <p className="feedback-error">✖️ {submitError[fid]}</p>
              )}
              <button
                className="feedback-btn"
                disabled={submitting[fid]}
                onClick={() => handleSubmit(fid)}
              >
                {submitting[fid] ? "Gönderiliyor…" : "Gönder"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
