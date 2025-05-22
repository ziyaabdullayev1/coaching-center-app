// src/pages/TeacherExamPage.jsx

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AddExamDefinition from "../components/AddExamDefinition";
import AssignExamForm from "../components/AssignExamForm";
import AddExamResult from "../components/AddExamResult";
import ReviewExamResults from "../components/ReviewExamResults";

export default function TeacherExamPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("define"); // "define" | "assign" | "result" | "review" | "analysis"

  const tabs = [
    { key: "define", label: "📝 Şablon Oluştur" },
    { key: "assign", label: "👥 Öğrencilere Ata" },
    { key: "result", label: "✏️ Sonuç Girişi" },
    { key: "review", label: "🧐 Sonuçları İncele" },
    { key: "analysis", label: "📊 Analiz" },
  ];

  const handleTabChange = (tab) => {
    if (tab === "analysis") {
      navigate("/dashboard/teacher/exam-analysis");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        📋 Sınav Yönetimi
      </h2>

      {/* Sekme Butonları */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              padding: "0.6rem 1.2rem",
              cursor: "pointer",
              border: "none",
              borderBottom:
                activeTab === tab.key
                  ? "3px solid #2563eb"
                  : "3px solid transparent",
              background: "none",
              fontWeight: activeTab === tab.key ? "bold" : "normal",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* İçerik */}
      {activeTab === "define" && (
        <AddExamDefinition teacherId={user.id} />
      )}

      {activeTab === "assign" && (
        <>
          <h3 style={{ marginBottom: "1rem" }}>➕ Şablonu Öğrencilere Ata</h3>
          <AssignExamForm teacherId={user.id} />
        </>
      )}

      {activeTab === "result" && (
        <AddExamResult teacherId={user.id} />
      )}

      {activeTab === "review" && (
        <ReviewExamResults teacherId={user.id} />
      )}
    </div>
  );
}
