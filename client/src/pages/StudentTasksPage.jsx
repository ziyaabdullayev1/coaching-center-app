import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchTasksByStudentId, updateTaskStatus } from "../services/requests";

export default function StudentTasksPage() {
  const { user } = useAuth(); // Supabase kullanıcısı
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;

      const studentId = user.user_metadata?.student_id || user.id;
      const data = await fetchTasksByStudentId(studentId);

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Görevler alınamadı:", data);
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
      <h2>📘 Your Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
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
            <strong>Day {task.day}</strong>
            <p>
              <b>Topic:</b> {task.topic}
            </p>
            <p>
              <b>Questions:</b> {task.question_count}
            </p>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id, task.completed)}
              />
              {task.completed ? "Completed" : "Incomplete"}
            </label>
          </div>
        ))
      )}
    </div>
  );
}
