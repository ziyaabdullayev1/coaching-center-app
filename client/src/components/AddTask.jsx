import { useEffect, useState } from "react";
import { createTask } from "../services/requests";

export default function AddTask({ onTaskAdded }) {
  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState("");

  const [day, setDay] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("");

  // 🎯 Goal'leri çek
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/goals"); // API endpoint
        const data = await res.json();
        setGoals(data || []);
      } catch (err) {
        console.error("Error fetching goals:", err);
        setGoals([]);
      }
    };

    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!goalId) {
      alert("Please select a goal.");
      return;
    }

    const taskPayload = {
      goal_id: goalId,
      day: Number(day),
      topic,
      question_count: Number(questionCount),
      completed: false,
    };
    console.log("📤 Task payload:", taskPayload);

    const createdTask = await createTask(taskPayload);

    if (createdTask) {
      alert("Task saved!");
      setGoalId("");
      setDay("");
      setTopic("");
      setQuestionCount("");
      onTaskAdded?.();
    } else {
      alert("Task could not be created.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      {/* 🎯 Goal seçimi */}
      <select value={goalId} onChange={(e) => setGoalId(e.target.value)} required>
        <option value="">Select Goal</option>
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.lesson} - {goal.total_questions}Q
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Day (e.g., 1)"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Topic (e.g., Algebra)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Question Count"
        value={questionCount}
        onChange={(e) => setQuestionCount(e.target.value)}
        required
      />

      <button type="submit">Save Task</button>
    </form>
  );
}
