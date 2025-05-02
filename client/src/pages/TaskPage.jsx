import { useState } from "react";
import AddTask from "../components/AddTask";
import AddGoal from "../components/AddGoal";
import TaskList from "../components/TaskList";

export default function TaskPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataRefresh = () => {
    setRefreshKey((old) => old + 1);
  };

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
        📝 Task Management
      </h2>

      {/* 🎯 GOAL EKLEME */}
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
        <AddGoal onGoalAdded={handleDataRefresh} />
      </div>

      {/* ➕ TASK EKLEME */}
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
        <AddTask onTaskAdded={handleDataRefresh} />
      </div>

      {/* 📋 TASK LİSTESİ */}
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
