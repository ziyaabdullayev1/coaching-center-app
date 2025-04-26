import { useState } from "react";

export default function AddStudent({ onStudentAdded }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      name: fullName,
      email,
      grade,
    });

    const response = await fetch("http://localhost:3001/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email,
        grade,
      }),
    });

    if (response.ok) {
      setFullName("");
      setEmail("");
      setGrade("");
      onStudentAdded();
    } else {
      alert("Failed to add student");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>Add New Student</h3>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        style={{ marginRight: "1rem" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginRight: "1rem" }}
      />
      <input
        type="text"
        placeholder="Grade (e.g., 7th, 8th)"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        required
        style={{ marginRight: "1rem" }}
      />
      <button type="submit">Add Student</button>
    </form>
  );
}
