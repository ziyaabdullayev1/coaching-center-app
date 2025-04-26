import { useState } from "react";

export default function EditStudent({ student, onCancel, onSave }) {
  const [fullName, setFullName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [grade, setGrade] = useState(student.grade);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedStudent = {
      name: fullName,
      email,
      grade,
    };

    const response = await fetch(`http://localhost:3001/api/students/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });

    if (response.ok) {
      onSave(); // Listeyi yenile
    } else {
      alert("Failed to update student");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        style={{ marginRight: "0.5rem" }}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginRight: "0.5rem" }}
      />
      <input
        type="text"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        required
        style={{ marginRight: "0.5rem" }}
      />
      <button type="submit" style={{ marginRight: "0.5rem" }}>Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
