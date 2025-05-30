import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchTopicMistakesForStudent } from "../services/examTopicMistakesRequests";
import "./StudentTopicMistakesPage.css";

export default function StudentTopicMistakesPage() {
  const { user } = useAuth();
  const [examData, setExamData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const loadExamData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const examsWithMistakes = await fetchTopicMistakesForStudent(user.email);
        console.log('Received exams with mistakes:', examsWithMistakes);
        
        // Transform and organize the data by lesson
        const examsByLesson = examsWithMistakes.reduce((acc, exam) => {
          // Group by lesson from topic mistakes
          exam.topic_mistakes.forEach(mistake => {
            const lesson = mistake.lesson || 'Diğer';
            if (!acc[lesson]) {
              acc[lesson] = [];
            }
            
            // Check if we already have this exam in this lesson's array
            const existingExam = acc[lesson].find(e => e.id === exam.id);
            if (existingExam) {
              // Add this mistake to existing exam's mistakes if it's not already there
              if (!existingExam.topic_mistakes.some(m => m.topic === mistake.topic)) {
                existingExam.topic_mistakes.push(mistake);
              }
            } else {
              // Add new exam entry with this mistake
              acc[lesson].push({
                ...exam,
                topic_mistakes: [mistake]
              });
            }
          });
          return acc;
        }, {});

        console.log('Organized exam data:', examsByLesson);
        setExamData(examsByLesson);
      } catch (e) {
        console.error('Error in loadExamData:', e);
        setError(e.message || "Sunucu hatası");
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [user]);

  const renderLessonSection = (lesson, exams) => {
    return (
      <div key={lesson} className="lesson-section">
        <h3 className="lesson-title">{lesson}</h3>
        <div className="exams-grid">
          {exams.map(exam => {
            const date = exam.date ? new Date(exam.date).toLocaleDateString() : "—";
            
            return (
              <div key={exam.id} className="exam-card">
                <div className="exam-header">
                  <span className="exam-date">{date}</span>
                  <span className="exam-name">{exam.template_name || "Sınav"}</span>
                </div>

                <div className="topic-mistakes">
                  <h4>Konu Bazlı Hatalar:</h4>
                  <div className="topic-mistakes-list">
                    {exam.topic_mistakes.map(mistake => (
                      <div key={`${exam.id}-${mistake.topic}`} className="topic-mistake">
                        <span className="topic">{mistake.topic}</span>
                        <span className="mistake-count">{mistake.mistake_count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <p className="status-message">⏳ Yükleniyor...</p>;
  if (error) return <p className="status-message error">Hata: {error}</p>;
  if (Object.keys(examData).length === 0) {
    return <p className="status-message">Henüz konu bazlı hata verisi bulunmuyor.</p>;
  }

  return (
    <div className="topic-mistakes-page">
      <h2 className="page-title">📚 Konu Bazlı Sınav Analizim</h2>
      <div className="lessons-container">
        {Object.entries(examData).map(([lesson, exams]) => 
          renderLessonSection(lesson, exams)
        )}
      </div>
    </div>
  );
} 