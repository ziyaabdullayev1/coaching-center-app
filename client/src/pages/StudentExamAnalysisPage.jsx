// src/pages/StudentExamAnalysisPage.jsx
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
import { format } from "date-fns";
import "./StudentExamAnalysisPage.css";

export default function StudentExamAnalysisPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const [trendData, setTrendData] = useState([]);
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
        all.sort((a, b) => new Date(b.exam_templates.date) - new Date(a.exam_templates.date));
        setAssignments(all);

        const lastTen = all.slice(0, 10).reverse();
        const trend = lastTen.map(a => {
          const date = a.exam_templates.date;
          const totalQ = a.exams.reduce((sum, r) => sum + r.correct + r.wrong + r.blank, 0);
          const totalC = a.exams.reduce((sum, r) => sum + r.correct, 0);
          return { date, score: +(totalC / totalQ * 100).toFixed(1) };
        });
        setTrendData(trend);

        const bands = { "0-50": 0, "50-75": 0, "75-100": 0 };
        trend.forEach(d => {
          if (d.score < 50) bands["0-50"]++;
          else if (d.score < 75) bands["50-75"]++;
          else bands["75-100"]++;
        });
        setBandData(Object.entries(bands).map(([range, count]) => ({ range, count })));

        const increasing = trend.every((d, i, arr) => i === 0 || d.score >= arr[i - 1].score);
        const summary = increasing
          ? "Son 10 sınavda başarı oranınız genel olarak artış gösteriyor."
          : trend.every((d, i, arr) => i === 0 || d.score <= arr[i - 1].score)
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

  const lessonChartData = assignments.slice(0, 10).reverse().flatMap(a => {
    const date = a.exam_templates.date;
    return a.exams.map(r => ({
      date,
      lesson: r.lesson,
      percentage: +((r.correct / (r.correct + r.wrong + r.blank)) * 100).toFixed(1)
    }));
  });

  const allowedLessons = ["Matematik", "Türkçe", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce"];
  const lessons = allowedLessons.filter(l => lessonChartData.some(d => d.lesson === l));

  return (
    <div className="analysis-page">
      <h2>📈 Sınav Analizim</h2>

      {/* Trend Chart */}
      <section className="chart-section large">
        <h3>Genel Başarı Trendiniz (Son 10 Sınav)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData} margin={{ top: 20, right: 40, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={tick => format(new Date(tick), 'dd/MM')}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={value => `${value}%`} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="score"
              name="Başarı %"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Lesson Detail Chart */}
      <section className="chart-section large">
        <h3>Konulara Göre Başarı</h3>
         <ResponsiveContainer width="100%" height={400} debounce={200}>
          <LineChart margin={{ top: 20, right: 40, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
             {/* Use timestamp-based, time scale X axis */}
        <XAxis
          dataKey="dateTs"
          type="number"
          domain={['dataMin', 'dataMax']}
          scale="time"
          tickFormatter={ts => format(new Date(ts), 'dd/MM')}
          angle={-45}
          textAnchor="end"
          height={70}
          interval={0}
          tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={value => `${value}%`} />
            <Legend verticalAlign="top" layout="horizontal" wrapperStyle={{ fontSize: 12, marginBottom: 10 }} />

              {lessons.map((lesson, idx) => (
                <Line
                  key={lesson}
                  type="monotone"
                  dataKey="percentage"
                  name={lesson}
                  data={lessonChartData
                    .filter(d => d.lesson === lesson)
                    .map(d => ({ ...d, dateTs: new Date(d.date).getTime() }))}
                  stroke={`hsl(${idx * 60}, 70%, 45%)`}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Band Chart */}
      <section className="chart-section">
        <h3>Başarı Dilimleri</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={bandData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />
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
