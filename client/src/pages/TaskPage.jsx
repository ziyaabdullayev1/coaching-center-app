import { useState } from "react";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import AddGoal from "../components/AddGoal"; // ✅ import eklendi

export default function TaskPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleTaskAdded = () => setRefreshKey((oldKey) => oldKey + 1);
  const handleGoalAdded = () => setRefreshKey((oldKey) => oldKey + 1); // Goal eklendiğinde de yenile

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", color: "#2563eb", marginBottom: "1.5rem" }}>
        📝 Tasks
      </h2>

      {/* ✅ Goal ekleme bölümü */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>🎯 Add New Goal</h3>
        <AddGoal onGoalAdded={handleGoalAdded} />
      </div>

      {/* ✅ Task ekleme bölümü */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>➕ Add New Task</h3>
        <AddTask onTaskAdded={handleTaskAdded} />
      </div>

      {/* ✅ Task listesi */}
      <div
        style={{
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>📋 Task List</h3>
        <TaskList key={refreshKey} />
      </div>
    </div>
  );
}
