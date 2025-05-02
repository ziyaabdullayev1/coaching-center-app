import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user?.email) return;
      const res = await fetch(`http://localhost:3001/api/students/email/${user.email}`);
      const data = await res.json();
      setStudentInfo(data);
    };

    fetchStudent();
  }, [user]);

  if (!studentInfo) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>📦 Veriler yükleniyor...</p>;
  }

  return (
    <div style={styles.container}>
      {/* Karşılama Bölümü */}
      <div style={styles.welcomeBox}>
      <img
  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studentInfo.name)}`}
  alt="Avatar"
/>
        <div>
          <h2 style={styles.heading}>Hoş Geldiniz, {studentInfo.name || "Öğrenci"}! 🎓</h2>
          <p style={styles.subtext}>Bugün başarıya bir adım daha yaklaştınız!</p>
        </div>
      </div>

      {/* Profil Bilgileri */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📄 Profil Bilgileri</h3>
        <p><strong>Email:</strong> {studentInfo.email}</p>
        <p><strong>Sınıf:</strong> {studentInfo.grade}</p>
        <p><strong>Kayıt Tarihi:</strong> {new Date(studentInfo.created_at).toLocaleDateString()}</p>
      </div>

      {/* Görev Butonu */}
      <button onClick={() => navigate("/dashboard/student/tasks")} style={styles.button}>
        🎯 Görevlerimi Görüntüle
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Segoe UI, sans-serif",
    color: "#1e293b"
  },
  welcomeBox: {
    display: "flex",
    alignItems: "center",
    background: "#eef2ff",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    gap: "1rem"
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#fff",
    padding: "4px",
    border: "2px solid #3b82f6"
  },
  heading: {
    fontSize: "1.5rem",
    margin: 0
  },
  subtext: {
    fontSize: "1rem",
    color: "#475569"
  },
  card: {
    background: "#f9fafb",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "2rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    color: "#2563eb"
  },
  button: {
    background: "#2563eb",
    color: "white",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "block",
    margin: "0 auto"
  }
};
