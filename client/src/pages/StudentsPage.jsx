import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase.from("students").select("*");
      if (!error) setStudents(data);
    }
    fetchStudents();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Öğrenciler</h1>
      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.id} className="bg-white shadow p-4 rounded">
            <strong>{s.name}</strong> – {s.email} – Sınıf: {s.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}
