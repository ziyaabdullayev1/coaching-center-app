// src/components/AddExamResult.jsx
import { useState, useEffect } from "react";
import { fetchTemplatesByTeacher } from "../services/examRequests";
import { createExams } from "../services/requests";

export default function AddExamResult({ teacherId }) {
  const [templates, setTemplates] = useState([]);
  const [selTpl, setSelTpl] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const tpls = await fetchTemplatesByTeacher(teacherId);
      setTemplates(tpls);
    };
    load();
  }, [teacherId]);

  useEffect(() => {
    if (selTpl?.exam_template_lessons) {
      setRows(
        selTpl.exam_template_lessons.map((l) => ({
          lesson: l.lesson,
          correct: 0,
          wrong: 0,
          blank: 0,
        }))
      );
    }
  }, [selTpl]);

  const handleRow = (i, field, value) => {
    const arr = [...rows];
    arr[i][field] = Number(value);
    setRows(arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selTpl) {
      alert("Önce bir şablon seçin.");
      return;
    }
    const payload = rows.map((r) => ({
      student_id: selTpl.student_id,  // şablonda student_id saklıysa, yoksa student seçimi ekle
      date: selTpl.date,
      lesson: r.lesson,
      correct: r.correct,
      wrong: r.wrong,
      blank: r.blank,
    }));
    const saved = await createExams(payload);
    if (saved) {
      alert("Sonuçlar kaydedildi!");
      setSelTpl(null);
      setRows([]);
    } else {
      alert("Hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h3>✏️ Sınav Sonuç Girişi</h3>

      {/* Eğer şablonlar henüz yoksa */}
      {!templates.length && <p>📋 Hiç şablon bulunamadı.</p>}

      <select
        value={selTpl?.id || ""}
        onChange={(e) =>
          setSelTpl(templates.find((t) => t.id === e.target.value) || null)
        }
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        <option value="">— Şablon Seç —</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({new Date(t.date).toLocaleDateString()})
          </option>
        ))}
      </select>

      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <div style={{ flex: 2, lineHeight: "2.5rem" }}>{r.lesson}</div>
          <input
            type="number"
            placeholder="Doğru"
            value={r.correct}
            min={0}
            onChange={(e) => handleRow(i, "correct", e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            placeholder="Yanlış"
            value={r.wrong}
            min={0}
            onChange={(e) => handleRow(i, "wrong", e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            placeholder="Boş"
            value={r.blank}
            min={0}
            onChange={(e) => handleRow(i, "blank", e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      ))}

      <button type="submit" style={{ marginTop: "1rem" }}>
        Sonuçları Kaydet
      </button>
    </form>
  );
}
