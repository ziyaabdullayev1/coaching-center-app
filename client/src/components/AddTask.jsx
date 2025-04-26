import { useState, useEffect } from "react";

export default function AddTask({ onTaskAdded }) {
  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState("");
  const [day, setDay] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      const response = await fetch("http://localhost:3001/api/goals");
      const data = await response.json();
      setGoals(data);
    };
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      goal_id: goalId,
      day: parseInt(day),
      topic,
      question_count: parseInt(questionCount),
      completed: false, // Başlangıçta tamamlanmadı
    };

    const response = await fetch("http://localhost:3001/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      setGoalId("");
      setDay("");
      setTopic("");
      setQuestionCount("");
      onTaskAdded(); // Listeyi güncelle
    } else {
      alert("Failed to add task");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>➕ Add New Task</h3>

      <select
        value={goalId}
        onChange={(e) => setGoalId(e.target.value)}
        required
        style={{ marginRight: "1rem" }}
      >
        <option value="">Select Goal</option>
        {goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.lesson} ({goal.start_date?.slice(0, 10)} - {goal.end_date?.slice(0, 10)})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Day (1, 2, 3...)"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        required
        style={{ marginRight: "1rem" }}
      />

      <input
        type="text"
        placeholder="Topic (e.g., Linear Equations)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        required
        style={{ marginRight: "1rem" }}
      />

      <input
        type="number"
        placeholder="Question Count"
        value={questionCount}
        onChange={(e) => setQuestionCount(e.target.value)}
        required
        style={{ marginRight: "1rem" }}
      />

      <button type="submit">Save Task</button>
    </form>
  );
}
