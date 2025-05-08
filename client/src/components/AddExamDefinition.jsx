// src/components/AddExamDefinition.jsx
import { useState } from "react";
import { createExamTemplate } from "../services/examRequests";

export default function AddExamDefinition({ teacherId }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [rows, setRows] = useState([{ lesson: "", question_count: 0 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Mutlaka teacher_id ilettiğimizden emin ol
    const payload = {
      teacher_id: teacherId,
      name,
      date,
      lessons: rows.map(r => ({
        lesson: r.lesson,
        question_count: Number(r.question_count),
      })),
    };

    console.log("▶️ Şablon payload:", payload);
    const ok = await createExamTemplate(payload);
    if (ok) {
      alert("Sınav şablonu kaydedildi!");
      // form reset vs.
    } else {
      alert("Şablon kaydederken hata oldu.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>📝 Sınav Tanımla</h3>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Sınav Adı"
        required
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />

      {/* Ders - soru sayısı satırları */}
      {rows.map((r, i) => (
        <div key={i}>
          <input
            placeholder="Ders"
            value={r.lesson}
            onChange={e => {
              const v = [...rows];
              v[i].lesson = e.target.value;
              setRows(v);
            }}
            required
          />
          <input
            type="number"
            placeholder="Soru Sayısı"
            value={r.question_count}
            onChange={e => {
              const v = [...rows];
              v[i].question_count = e.target.value;
              setRows(v);
            }}
            required
          />
        </div>
      ))}

      <button type="button" onClick={() => setRows([...rows, { lesson: "", question_count: 0 }])}>
        + Satır Ekle
      </button>

      <button type="submit">Kaydet</button>
    </form>
  );
}
