// src/components/ReviewExamResults.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ReviewExamResults() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState();

  useEffect(() => {
    if (!user?.id) return;
    fetch(
      `http://localhost:3001/api/exam-assignments/teacher/${user.id}/results`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setAssignments(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>🔄 Yükleniyor…</p>;
  if (error)   return <p style={{ color: "red" }}>Hata: {error}</p>;
    // drop any entries missing a real template name
    const validAssignments = assignments.filter(a =>
      a.exam_templates?.name
    );
  
    if (validAssignments.length === 0)
    return <p>📭 Henüz atanmış veya çözülmüş sınav yok.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>📑 Sınav Sonuçları</h2>
      {validAssignments.map((a) => {
        // guard missing exam_templates
        const tpl     = a.exam_templates || {};
        const lessons = tpl.exam_template_lessons || [];
        const results = a.exams || [];

        return (
          <div
            key={a.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: 6,
            }}
          >
            <h3>
              {tpl.name || "—"} (
              {tpl.date
                ? new Date(tpl.date).toLocaleDateString()
                : "—"}
              )
            </h3>
            <p>
              Öğrenci ID: <code>{a.student_id}</code>
            </p>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Konular</th>
                  <th>Soru Adet</th>
                  <th>Doğru</th>
                  <th>Yanlış</th>
                  <th>Boş</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => {
                  // find this lesson's result
                  const r = results.find((e) => e.lesson === l.lesson);
                  return (
                    <tr key={l.id}>
                      <td>{l.lesson}</td>
                      <td style={{ textAlign: "center" }}>
                        {l.question_count}
                      </td>
                      {r ? (
                        <>
                          <td style={{ textAlign: "center" }}>
                            {r.correct}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {r.wrong}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {r.blank}
                          </td>
                        </>
                      ) : (
                        <td
                          colSpan={3}
                          style={{ textAlign: "center", color: "#888" }}
                        >
                          Henüz çözülmedi
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
