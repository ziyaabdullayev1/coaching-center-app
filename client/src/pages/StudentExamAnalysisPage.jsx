import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchAssignmentsForStudentByEmail } from "../services/examAssignmentRequests";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./StudentExamAnalysisPage.css";

export default function StudentExamAnalysisPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // Derived states
  const [trendData, setTrendData] = useState([]);
  const [lessonData, setLessonData] = useState([]);
  const [bandData, setBandData] = useState([]);
  const [summaryText, setSummaryText] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const all = await fetchAssignmentsForStudentByEmail(user.email);
        // sort descending by date
        all.sort((a, b) => new Date(b.exam_templates.date) - new Date(a.exam_templates.date));
        setAssignments(all);

        // Trend: last 10
        const lastTen = all.slice(0, 10).reverse();
        const trend = lastTen.map(a => {
          const date = new Date(a.exam_templates.date).toLocaleDateString();
          const totalQ = a.exams.reduce((sum,r) => sum + r.correct + r.wrong + r.blank, 0);
          const totalC = a.exams.reduce((sum,r) => sum + r.correct, 0);
          return { name: date, score: +(totalC/totalQ*100).toFixed(1) };
        });
        setTrendData(trend);

        // Lesson detail: combine unique lessons
        const lessons = [...new Set(all.flatMap(a => a.exams.map(r => r.lesson)))];
        const lessonSeries = lessons.map(lesson => {
          const entry = { lesson };
          all.slice(0,10).reverse().forEach(a => {
            const date = new Date(a.exam_templates.date).toLocaleDateString();
            const rec = a.exams.find(r=>r.lesson===lesson);
            entry[date] = rec? +(rec.correct/(rec.correct+rec.wrong+rec.blank)*100).toFixed(1): null;
          });
          return entry;
        });
        setLessonData(lessonSeries);

        // Band data
        const bands = { "0-50":0, "50-75":0, "75-100":0 };
        trend.forEach(d => {
          if (d.score <50) bands["0-50"]++;
          else if (d.score <75) bands["50-75"]++;
          else bands["75-100"]++;
        });
        setBandData(Object.entries(bands).map(([k,v])=>({ range:k, count:v })));

        // Summary text
        const increasing = trend.every((d,i,arr) => i===0||d.score>=arr[i-1].score);
        const mixed = !increasing && !trend.every((d,i,arr)=>i===0||d.score<=arr[i-1].score);
        const summary = increasing
          ? "Son 10 sınavda başarı oranınız genel olarak artış gösteriyor."
          : trend.every((d,i,arr)=>i===0||d.score<=arr[i-1].score)
            ? "Son 10 sınavda başarı oranınız genel olarak azalma eğiliminde."
            : "Başarı oranınız dalgalı seyrediyor.";
        setSummaryText(summary);

      } catch (e) {
        setError(e.message || "Sunucu hatası");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <p className="status">⏳ Yükleniyor...</p>;
  if (error) return <p className="status error">Hata: {error}</p>;
  if (!assignments.length) return <p className="status">Henüz sınav veriniz yok.</p>;

  // X-axis keys for lesson chart
  const dates = trendData.map(d => d.name);

  return (
    <div className="analysis-page">
      <h2>📈 Sınav Analizim</h2>

      {/* Trend Chart */}
      <section className="chart-section">
        <h3>Genel Başarı Trendiniz (Son 10 Sınav)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData} margin={{ top:10, right:30, left:0, bottom:0 }}>
            <XAxis dataKey="name" />
            <YAxis domain={[0,100]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" name="Başarı %" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Lesson Detail Chart */}
      <section className="chart-section">
        <h3>Konulara Göre Başarı</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart margin={{ top:10, right:30, left:0, bottom:0 }}>
            <XAxis dataKey="name" ticks={dates} />
            <YAxis domain={[0,100]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {lessonData.map(series => (
              <Line
                key={series.lesson}
                type="monotone"
                data={trendData.map(d=>({ name:d.name, [series.lesson]: series[d.name] }))}
                dataKey={series.lesson}
                name={series.lesson}
                stroke={"#" + Math.floor(Math.random()*16777215).toString(16)}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Band Chart */}
      <section className="chart-section">
        <h3>Başarı Dilimleri</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={bandData} margin={{ top:10, right:30, left:0, bottom:0 }}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" name="Sınav Sayısı" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Summary */}
      <section className="summary-section">
        <h3>Genel Değerlendirme</h3>
        <p>{summaryText}</p>
      </section>
    </div>
  );
}