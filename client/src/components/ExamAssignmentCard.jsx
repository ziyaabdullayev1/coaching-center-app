import { useState } from "react";

export default function ExamAssignmentCard({ assignment, onSubmit }) {
  const { exam_templates: tpl } = assignment;
  const [answers, setAnswers] = useState(
    tpl.exam_template_lessons.map(l => ({
      lesson: l.lesson, correct: 0, wrong: 0, blank: 0
    }))
  );

  const handleChange = (idx, field, val) => {
    const arr = [...answers];
    arr[idx][field] = Number(val);
    setAnswers(arr);
  };

  return (
    <div style={{border:"1px solid #ddd",padding:"1rem",margin:"1rem 0"}}>
      <h3>{tpl.name} — {new Date(tpl.date).toLocaleDateString()}</h3>
      {answers.map((ans, i) => (
        <div key={i}>
          <strong>{ans.lesson} ({tpl.exam_template_lessons[i].question_count} soru)</strong>
          <label>✅ <input type="number" min="0"
            value={ans.correct}
            onChange={e=>handleChange(i,"correct",e.target.value)}
          /></label>
          <label>❌ <input type="number" min="0"
            value={ans.wrong}
            onChange={e=>handleChange(i,"wrong",e.target.value)}
          /></label>
          <label>➖ <input type="number" min="0"
            value={ans.blank}
            onChange={e=>handleChange(i,"blank",e.target.value)}
          /></label>
        </div>
      ))}
      <button onClick={()=>onSubmit(assignment, answers)}>Sonuçları Gönder</button>
    </div>
  );
}
