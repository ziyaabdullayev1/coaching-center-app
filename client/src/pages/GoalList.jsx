// import { useEffect, useState } from "react";
// import AddGoal from "../components/AddGoal";

// export default function GoalList() {
//   const [goals, setGoals] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchGoals = async () => {
//     const response = await fetch("http://localhost:3001/api/goals");
//     const data = await response.json();
//     setGoals(data);
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this goal?")) return;

//     await fetch(`http://localhost:3001/api/goals/${id}`, {
//       method: "DELETE",
//     });

//     fetchGoals();
//   };

//   useEffect(() => {
//     fetchGoals();
//   }, []);

//   if (loading) return <p>Loading goals...</p>;

//   return (
//     <div className="auth-card">
//       <h2>🎯 Goals</h2>
//       <AddGoal onGoalAdded={fetchGoals} />

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//           gap: "1rem",
//           marginTop: "2rem",
//         }}
//       >
//         {goals.map((goal) => (
//           <div
//             key={goal.id}
//             style={{
//               backgroundColor: "#f1f1f1",
//               padding: "1.5rem",
//               borderRadius: "8px",
//               boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <h3 style={{ marginBottom: "0.5rem" }}>{goal.lesson}</h3>
//             <p style={{ marginBottom: "0.25rem" }}>
//               <strong>Total Questions:</strong> {goal.total_questions}
//             </p>
//             <p style={{ marginBottom: "0.25rem" }}>
//               <strong>Start:</strong> {goal.start_date?.slice(0, 10)}
//             </p>
//             <p style={{ marginBottom: "0.25rem" }}>
//               <strong>End:</strong> {goal.end_date?.slice(0, 10)}
//             </p>

//             <button
//               onClick={() => handleDelete(goal.id)}
//               style={{
//                 marginTop: "1rem",
//                 backgroundColor: "red",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 padding: "0.5rem 1rem",
//               }}
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
