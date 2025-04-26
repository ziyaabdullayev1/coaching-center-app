import { useEffect, useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:3001/api/tasks");
    const data = await response.json();
    setTasks(data);
    setLoading(false);
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    fetchTasks(); // Durumu güncelle
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="auth-card">
      <h2>📋 Task List</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4 style={{ marginBottom: "0.5rem" }}>Day {task.day}</h4>
              <p><strong>Topic:</strong> {task.topic}</p>
              <p><strong>Questions:</strong> {task.question_count}</p>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id, task.completed)}
                  style={{ marginRight: "0.5rem" }}
                />
                {task.completed ? "Completed" : "Incomplete"}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
