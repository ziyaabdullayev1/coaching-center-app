import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!user?.email) return;
      const res = await fetch(`http://localhost:3001/api/teachers/email/${user.email}`);
      const data = await res.json();
      setTeacher(data);
    };

    fetchTeacher();
  }, [user]);

  if (!teacher) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>🔄 Bilgiler yükleniyor...</p>;
  }

  return (
    <div style={styles.container}>
      {/* Karşılama */}
      <div style={styles.welcomeBox}>
        <img
          src={`https://avatars.dicebear.com/api/initials/${teacher.name}.svg`}
          alt="Avatar"
          style={styles.avatar}
        />
        <div>
          <h2 style={styles.heading}>Hoş Geldiniz, {teacher.name}! 👩‍🏫</h2>
          <p style={styles.subtext}>Bugün öğrencilerinizin yoluna ışık tutabilirsiniz.</p>
        </div>
      </div>

      {/* Profil Bilgisi */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📄 Profil Bilgileri</h3>
        <p><strong>Email:</strong> {teacher.email}</p>
        <p><strong>Rol:</strong> Öğretmen</p>
        <p><strong>Katılım Tarihi:</strong> {new Date(teacher.created_at).toLocaleDateString()}</p>
      </div>

      {/* Görev/Hedef Butonu */}
      <button
        onClick={() => navigate("/dashboard/teacher/tasks")}
        style={styles.button}
      >
        🎯 Öğrenci Hedefleri ve Görevlerini Yönet
      </button>
      
      {/* Sınav Yönetimi Link’i */}
     <Link to="/dashboard/teacher/exams">
       <button style={{ ...styles.button, marginTop: "1rem", background: "#3b82f6" }}>
         📋 Sınav Yönetimi
       </button>
     </Link>
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
    background: "#ecfdf5",
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
    border: "2px solid #10b981"
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
    color: "#10b981"
  },
  button: {
    background: "#10b981",
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
