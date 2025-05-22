// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  fetchAssignmentsForStudent,
  createExamResult
} from "../services/examAssignmentRequests";

export default function StudentDashboard() {
  const { user } = useAuth();

  const [studentInfo, setStudentInfo] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [solvingId, setSolvingId] = useState(null);
  const [lessonResults, setLessonResults] = useState({});
  const [loading, setLoading] = useState(true);

  // 1) Öğrenci bilgilerini çek
  useEffect(() => {
    if (!user?.email) return;
    fetch(`http://localhost:3001/api/students/email/${user.email}`)
      .then((res) => res.json())
      .then(setStudentInfo)
      .catch(console.error);
  }, [user]);

  // 2) Atanan sınavları nested lessons ile çek
  useEffect(() => {
    if (!studentInfo?.id) return;
    fetchAssignmentsForStudent(studentInfo.id)
      .then((data) => setAssignments(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentInfo]);

  // 3) Sınav çözmeye başla
  const startSolving = (assignment) => {
    const tpl = assignment.exam_templates;
    const lessons = tpl?.exam_template_lessons;
    if (!lessons || lessons.length === 0) {
      return alert("Bu sınav için ders bilgisi bulunamadı.");
    }
    setSolvingId(assignment.id);
    const initial = {};
    lessons.forEach((l) => {
      initial[l.id] = { correct: "", wrong: "", blank: "" };
    });
    setLessonResults(initial);
  };

  // 4) Her lesson için ayrı gönderim
  const submitLesson = async (assignment, lesson) => {
    const resObj = lessonResults[lesson.id];
    if (
      resObj.correct === "" ||
      resObj.wrong === "" ||
      resObj.blank === ""
    ) {
      return alert("Lütfen tüm alanları doldurun.");
    }
    const payload = {
      assignment_id: assignment.id,
      student_id: studentInfo.id,
      date: assignment.exam_templates.date,
      lesson: lesson.lesson,
      correct: Number(resObj.correct),
      wrong: Number(resObj.wrong),
      blank: Number(resObj.blank),
    };
    const ok = await createExamResult(payload);
    if (ok) {
      alert(`${lesson.lesson} sonucunuz kaydedildi!`);
      setLessonResults((prev) => {
        const nxt = { ...prev };
        delete nxt[lesson.id];
        return nxt;
      });
    } else {
      alert("Kaydederken hata oluştu.");
    }
  };

  if (!studentInfo || loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        📦 Veriler yükleniyor...
      </p>
    );
  }

  return (
    <div style={styles.container}>
      {/* Karşılama */}
      <div style={styles.welcomeBox}>
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            studentInfo.name
          )}`}
          alt="Avatar"
          style={styles.avatar}
        />
        <div>
          <h2 style={styles.heading}>
            Hoş Geldiniz, {studentInfo.name}! 🎓
          </h2>
          <p style={styles.subtext}>
            Bugün başarıya bir adım daha yaklaştınız!
          </p>
        </div>
      </div>

      {/* Profil */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📄 Profil Bilgileri</h3>
        <p><strong>Email:</strong> {studentInfo.email}</p>
        <p><strong>Sınıf:</strong> {studentInfo.grade}</p>
        <p>
          <strong>Kayıt Tarihi:</strong>{" "}
          {new Date(studentInfo.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Hızlı Erişim */}
      <div style={styles.buttons}>
        <Link to="/dashboard/student/tasks">
          <button style={styles.btn}>📋 Görevlerim</button>
        </Link>
        <Link to="/dashboard/student/exams">
          <button style={styles.btn}>📊 Sınav Sonuçlarım</button>
        </Link>
        <Link to="/dashboard/student/analysis">
          <button style={styles.btn}>📈 Sınav Analizim</button>
          </Link>
      </div>

      {/* Atanan Sınavlar & Çözüm */}
      <section style={{ marginTop: "2rem" }}>
        <h3>📌 Size Atanan Sınavlar</h3>
        {assignments.length === 0 ? (
          <p>Henüz size atanmış bir sınav yok.</p>
        ) : (
          assignments.map((a) => {
            const tpl = a.exam_templates || {};
            const lessons = tpl.exam_template_lessons || [];
            return (
              <div key={a.id} style={styles.card}>
                <strong>{tpl.name || "İsimsiz Sınav"}</strong>
                <p>Tarih: {tpl.date ? new Date(tpl.date).toLocaleDateString() : "-"}</p>

                {solvingId !== a.id ? (
                  <button
                    onClick={() => startSolving(a)}
                    style={styles.solveBtn}
                  >
                    ▶️ Sınavı Çöz
                  </button>
                ) : (
                  lessons.map((l) => {
                    // zaten girilmişse
                    if (!lessonResults[l.id]) {
                      return (
                        <p key={l.id} style={{ color: "#10b981" }}>
                          ✔ {l.lesson} ({l.question_count} soru) kaydedildi!
                        </p>
                      );
                    }
                    const resObj = lessonResults[l.id];
                    return (
                      <div key={l.id} style={styles.lessonRow}>
                        <span>
                          {l.lesson} ({l.question_count} soru)
                        </span>
                        <input
                          type="number"
                          placeholder="Doğru"
                          value={resObj.correct}
                          onChange={(e) =>
                            setLessonResults((prev) => ({
                              ...prev,
                              [l.id]: {
                                ...prev[l.id],
                                correct: e.target.value,
                              },
                            }))
                          }
                          style={styles.smallInput}
                        />
                        <input
                          type="number"
                          placeholder="Yanlış"
                          value={resObj.wrong}
                          onChange={(e) =>
                            setLessonResults((prev) => ({
                              ...prev,
                              [l.id]: {
                                ...prev[l.id],
                                wrong: e.target.value,
                              },
                            }))
                          }
                          style={styles.smallInput}
                        />
                        <input
                          type="number"
                          placeholder="Boş"
                          value={resObj.blank}
                          onChange={(e) =>
                            setLessonResults((prev) => ({
                              ...prev,
                              [l.id]: {
                                ...prev[l.id],
                                blank: e.target.value,
                              },
                            }))
                          }
                          style={styles.smallInput}
                        />
                        <button
                          onClick={() => submitLesson(a, l)}
                          style={styles.solveBtn}
                        >
                          Gönder
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Segoe UI, sans-serif",
    color: "#1e293b",
  },
  welcomeBox: {
    display: "flex",
    alignItems: "center",
    background: "#eef2ff",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    gap: "1rem",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#fff",
    padding: "4px",
    border: "2px solid #3b82f6",
  },
  heading: { fontSize: "1.5rem", margin: 0 },
  subtext: { fontSize: "1rem", color: "#475569" },
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "1rem",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1rem",
  },
  btn: {
    background: "#2563eb",
    color: "#fff",
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  solveBtn: {
    background: "#10b981",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  lessonRow: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    marginTop: "0.75rem",
  },
  smallInput: {
    width: "4rem",
    padding: "0.3rem",
  },
};
