export default function Features() {
  const items = [
    { emoji: '🗓️', title: 'Planlama', text: 'Günlük ve haftalık hedeflerinizi kolayca oluşturun.' },
    { emoji: '✅', title: 'Takip', text: 'Görev ilerlemenizi gerçek zamanlı işaretleyin.' },
    { emoji: '📊', title: 'Analitik', text: 'Başarı oranınızı grafiklerle görün.' },
  ];

  return (
    <section style={featuresStyles.section}>
      <h2 style={featuresStyles.heading}>Öne Çıkan Özellikler</h2>
      <div style={featuresStyles.grid}>
        {items.map((item) => (
          <div key={item.title} style={featuresStyles.card}>
            <div style={featuresStyles.icon}>{item.emoji}</div>
            <h3 style={featuresStyles.title}>{item.title}</h3>
            <p style={featuresStyles.text}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const featuresStyles = {
  section: {
    maxWidth: '1000px',
    margin: '4rem auto',
    padding: '0 1rem',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#1e293b',
  },
  grid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  },
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    color: '#1e293b',
  },
  text: {
    fontSize: '1rem',
    color: '#475569',
  }
};
