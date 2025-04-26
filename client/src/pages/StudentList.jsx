import { useEffect, useState } from "react";
import AddStudent from "../components/AddStudent";
import EditStudent from "../components/EditStudent";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState(null);

  const fetchStudents = async () => {
    const response = await fetch("http://localhost:3001/api/students");
    const data = await response.json();
    setStudents(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    await fetch(`http://localhost:3001/api/students/${id}`, {
      method: "DELETE",
    });

    fetchStudents();
  };

  const startEditing = (id) => {
    setEditingStudentId(id);
  };

  const stopEditing = () => {
    setEditingStudentId(null);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="auth-card">
      <h2>📚 Students</h2>
      <AddStudent onStudentAdded={fetchStudents} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {students.map((student) => (
          <div
            key={student.id}
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {editingStudentId === student.id ? (
              <EditStudent student={student} onCancel={stopEditing} onSave={stopEditing} />
            ) : (
              <>
                <div>
                  <h3 style={{ marginBottom: "0.5rem" }}>{student.name}</h3>
                  <p style={{ marginBottom: "0.25rem" }}>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Grade:</strong> {student.grade}
                  </p>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => startEditing(student.id)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      padding: "0.5rem 1rem",
                      marginRight: "0.5rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
