import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section style={heroStyles.wrapper}>
      <div style={heroStyles.overlay} />
      <div style={heroStyles.content}>
        <h1 style={heroStyles.title}>Öğrenciler İçin Akıllı Görev Takibi</h1>
        <p style={heroStyles.subtitle}>
          Kişiselleştirilmiş planlar, gerçek zamanlı takip, ve güçlü analizler ile akademik başarınızı zirveye taşıyın.
        </p>
        <Link to="/signup">
          <button style={heroStyles.cta}>Hemen Başla</button>
        </Link>
      </div>
    </section>
  );
}

const heroStyles = {
  wrapper: {
    position: 'relative',
    height: '70vh',
    backgroundImage: 'url(https://source.unsplash.com/1600x900/?education,study)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
  },
  content: {
    position: 'relative',
    color: '#fff',
    textAlign: 'center',
    maxWidth: '600px',
    padding: '0 1rem',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    lineHeight: 1.5,
  },
  cta: {
    background: '#2563eb',
    border: 'none',
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};