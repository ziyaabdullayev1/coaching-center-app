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
import "../pages/StudentExamAnalysisPage.css";

export default function TeacherExamAnalysisPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [filterText, setFilterText] = useState("");

  const [trendData, setTrendData] = useState([]);
  const [bandData, setBandData] = useState([]);
  const [summaryText, setSummaryText] = useState("");

  // Fetch list of students for the teacher
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;
      
      try {
        // Use full URL path to the backend
        const response = await fetch(`http://localhost:3001/api/teachers/${user.id}/students`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Server response:', {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          });
          throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        // Sort students by name for easier selection
        data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(data);
      } catch (e) {
        console.error("Error fetching students:", e);
        setError(`Failed to load students list: ${e.message}`);
      }
    };
    
    fetchStudents();
  }, [user]);

  // Load student exam data when a student is selected
  useEffect(() => {
    const loadStudentData = async () => {
      if (!selectedStudent) {
        setAssignments([]);
        setTrendData([]);
        setBandData([]);
        setSummaryText("");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const all = await fetchAssignmentsForStudentByEmail(selectedStudent);
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
          ? "Son 10 sınavda başarı oranı genel olarak artış gösteriyor."
          : trend.every((d, i, arr) => i === 0 || d.score <= arr[i - 1].score)
          ? "Son 10 sınavda başarı oranı genel olarak azalma eğiliminde."
          : "Başarı oranı dalgalı seyrediyor.";
        setSummaryText(summary);
      } catch (e) {
        setError(e.message || "Sunucu hatası");
      } finally {
        setLoading(false);
      }
    };
    
    loadStudentData();
  }, [selectedStudent]);

  const renderAnalysisContent = () => {
    if (loading) return <p className="status">⏳ Yükleniyor...</p>;
    if (error) return <p className="status error">Hata: {error}</p>;
    if (!selectedStudent) return <p className="status">Lütfen bir öğrenci seçiniz.</p>;
    if (!assignments.length) return <p className="status">Bu öğrenciye ait sınav verisi bulunmuyor.</p>;

    const lessonChartData = assignments.slice(0, 10).reverse().flatMap(a => {
      const date = a.exam_templates.date;
      return a.exams.map(r => ({
        date,
        lesson: r.lesson,
        percentage: +((r.correct / (r.correct + r.wrong + r.blank)) * 100).toFixed(1),
        id: `${r.lesson}-${date}`
      }));
    });

    const allowedLessons = ["Matematik", "Türkçe", "Fen Bilimleri", "Sosyal Bilgiler", "İngilizce"];
    const lessons = allowedLessons.filter(l => lessonChartData.some(d => d.lesson === l));

    return (
      <>
        {/* Trend Chart */}
        <section className="chart-section large">
          <h3>Genel Başarı Trendi (Son 10 Sınav)</h3>
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
              <XAxis
                dataKey="dateTs"
                type="number"
                domain={['dataMin', 'dataMax']}
                scale="time"
                tickFormatter={ts => format(new Date(ts), 'dd/MM')}
                angle={-45}
                textAnchor="end"
                height={70}
                ticks={[...new Set(lessonChartData.map(d => new Date(d.date).getTime()))].sort()}
                interval="preserveStartEnd"
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="end"
                      fill="#666"
                      transform="rotate(-45)"
                      style={{ fontSize: '12px' }}
                    >
                      {format(new Date(payload.value), 'dd/MM')}
                    </text>
                  </g>
                )}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={value => `${value}%`}
                labelFormatter={ts => format(new Date(ts), 'dd/MM/yyyy')}
              />
              <Legend verticalAlign="top" layout="horizontal" wrapperStyle={{ fontSize: 12, marginBottom: 10 }} />

              {lessons.map((lesson, idx) => {
                const lessonData = lessonChartData
                  .filter(d => d.lesson === lesson)
                  .map(d => ({
                    ...d,
                    dateTs: new Date(d.date).getTime(),
                    key: d.id
                  }))
                  .sort((a, b) => a.dateTs - b.dateTs);
                
                return (
                  <Line
                    key={`line-${lesson}`}
                    type="monotone"
                    dataKey="percentage"
                    name={lesson}
                    data={lessonData}
                    stroke={`hsl(${idx * 60}, 70%, 45%)`}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls
                  />
                );
              })}
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
      </>
    );
  };
  
  // Filter students based on search text
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(filterText.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="analysis-page">
      <h2>📊 Öğrenci Sınav Analizi</h2>
      
      {/* Student Selector */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Öğrenci ara..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              padding: "0.5rem",
              width: "300px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "0.5rem"
            }}
          />
        </div>
        
        <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #eee", borderRadius: "4px" }}>
          {filteredStudents.length === 0 ? (
            <p style={{ textAlign: "center", padding: "1rem" }}>Öğrenci bulunamadı</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {filteredStudents.map(student => (
                <li 
                  key={student.id}
                  onClick={() => setSelectedStudent(student.email)}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    backgroundColor: selectedStudent === student.email ? "#e0f2fe" : "transparent",
                    borderBottom: "1px solid #eee",
                    transition: "background-color 0.2s"
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{student.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>{student.email}</div>
                  {student.grade && <div style={{ fontSize: "0.8rem", color: "#666" }}>Sınıf: {student.grade}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {renderAnalysisContent()}
    </div>
  );
} 