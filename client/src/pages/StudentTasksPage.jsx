import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchTasksByStudentId,
  updateTaskStatus,
} from "../services/requests";

export default function StudentTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError("");

      try {
        if (!user?.email) {
          setError("Kullanıcı oturumu bulunamadı.");
          return;
        }

        // 🔍 Öğrenciyi email ile çek
        const res = await fetch(`/api/students/email/${user.email}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("🚫 API yanıtı:", text.slice(0, 200));
          setError(`Öğrenci bulunamadı (${res.status})`);
          return;
        }

        let student = null;

        try {
          student = await res.clone().json(); // clone sayesinde hata alınmaz
        } catch (jsonErr) {
          const text = await res.text();
          console.error("❌ JSON Parse Hatası:", jsonErr.message);
          console.error("🧾 Gelen veri:", text.slice(0, 200));
          setError("Veri işlenemedi. JSON formatı hatalı.");
          return;
        }

        if (!student?.id) {
          setError("Öğrenci ID'si bulunamadı.");
          return;
        }

        setStudentId(student.id);

        // ✅ Görevleri getir
        const taskData = await fetchTasksByStudentId(student.id);
        if (Array.isArray(taskData)) {
          setTasks(taskData);
        } else {
          console.error("❌ Görev listesi alınamadı:", taskData);
          setError("Görev listesi alınamadı.");
        }
      } catch (err) {
        console.error("❌ Beklenmeyen hata:", err.message);
        setError("Sunucuya bağlanırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  const handleToggle = async (taskId, currentStatus) => {
    const updated = await updateTaskStatus(taskId, !currentStatus);
    if (updated) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>📘 Görevlerim</h2>

      {loading ? (
        <p>⏳ Yükleniyor...</p>
      ) : error ? (
        <p style={{ color: "red" }}>❌ {error}</p>
      ) : tasks.length === 0 ? (
        <p>Henüz görev atanmadı.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <strong>Gün {task.day}</strong>
            <p>
              <b>Konu:</b> {task.topic}
            </p>
            <p>
              <b>Soru Sayısı:</b> {task.question_count}
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id, task.completed)}
              />
              {task.completed ? "✔️ Tamamlandı" : "⬜ Henüz tamamlanmadı"}
            </label>
          </div>
        ))
      )}
    </div>
  );
}
