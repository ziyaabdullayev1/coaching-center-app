// src/components/ReviewExamResults.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ReviewExamResults() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:3001/api/exam-assignments/teacher/${user.id}/results`
        );
        if (!res.ok) {
          throw new Error(`Sunucu hatası: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  if (loading) return <p>🔄 Yükleniyor…</p>;
  if (error)    return <p style={{ color: "red" }}>Hata: {error}</p>;
  if (results.length === 0)
    return <p>📭 Henüz atanmış veya çözülmüş sınav yok.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>📑 Sınav Sonuçları</h2>
      {results.map((a) => {
        const tpl = a.exam_templates;
        const lessons = tpl.exam_template_lessons || [];
        const resArr  = a.exam_results || [];

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
              {tpl.name} — {new Date(tpl.date).toLocaleDateString()}
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
                  // bul varsa bu lesson için girilmiş sonucu
                  const found = resArr.find((r) => r.lesson === l.lesson);
                  return (
                    <tr key={l.id}>
                      <td>{l.lesson}</td>
                      <td style={{ textAlign: "center" }}>
                        {l.question_count}
                      </td>
                      {found ? (
                        <>
                          <td style={{ textAlign: "center" }}>
                            {found.correct}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {found.wrong}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {found.blank}
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
