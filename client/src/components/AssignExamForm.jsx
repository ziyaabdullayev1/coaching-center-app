// src/components/AssignExamForm.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchTemplatesByTeacher } from "../services/examRequests";
import { fetchStudents } from "../services/requests";
import { assignExamTemplate } from "../services/examAssignmentRequests";

export default function AssignExamForm() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [mode, setMode] = useState("all"); // all | grade | list

  // sadece grade modu için
  const [grade, setGrade] = useState("");

  // tüm öğrencileri çek (list modu için)
  const [studentList, setStudentList] = useState([]);
  // seçili öğrenci id'leri
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchTemplatesByTeacher(user.id).then(setTemplates);
    fetchStudents().then(setStudentList);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!templateId) {
      return alert("Önce bir şablon seçin.");
    }

    const payload = { template_id: templateId };
    if (mode === "grade") {
      if (!grade) return alert("Bir grade girin.");
      payload.grade = grade;
    } else if (mode === "list") {
      if (selectedStudents.length === 0) return alert("En az bir öğrenci seçin.");
      payload.students = selectedStudents;
    }
    const ok = await assignExamTemplate(payload);
    if (ok) alert("Şablon öğrencilere başarıyla atandı!");
    else alert("Atama sırasında hata oluştu.");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
      {/* Şablon seçimi */}
      <label>
        Şablon:
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          required
        >
          <option value="">-- Şablon Seç --</option>
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name} ({new Date(tpl.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </label>

      {/* Atama modu seçimi */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>
          <input
            type="radio"
            checked={mode === "all"}
            onChange={() => setMode("all")}
          />{" "}
          Tüm Öğrencilere
        </label>
        <label>
          <input
            type="radio"
            checked={mode === "grade"}
            onChange={() => setMode("grade")}
          />{" "}
          Belirli Grade
        </label>
        <label>
          <input
            type="radio"
            checked={mode === "list"}
            onChange={() => setMode("list")}
          />{" "}
          Seçili Öğrenciler
        </label>
      </div>

      {/* Grade input */}
      {mode === "grade" && (
        <label>
          Grade (örn. 6th):
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="6th, 7th..."
            required
          />
        </label>
      )}

      {/* Çoklu seçim */}
      {mode === "list" && (
        <label>
          Öğrencileri seçin (Ctrl / Cmd tıkla):
          <select
            multiple
            size={5}
            value={selectedStudents}
            onChange={(e) => {
              const opts = Array.from(e.target.selectedOptions).map(
                (o) => o.value
              );
              setSelectedStudents(opts);
            }}
            style={{ minHeight: "8rem" }}
          >
            {studentList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.grade})
              </option>
            ))}
          </select>
        </label>
      )}

      <button type="submit" style={{ padding: "0.6rem 1.2rem" }}>
        Ata
      </button>
    </form>
  );
}
