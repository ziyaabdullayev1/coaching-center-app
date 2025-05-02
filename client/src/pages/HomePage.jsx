import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';

export default function HomePage() {
  return (
    <div style={{ background: '#f8fafc' }}>
      <Navbar />
      <HeroSection />
      <Features />

      <section style={{ maxWidth: '1000px', margin: '4rem auto', padding: '1rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '2rem', color: '#1e293b' }}>
          Kullanıcı Rolleri
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={roleCard}>👨‍🎓 Öğrenci<br /><small>Görev takibi ve başarı analizi</small></div>
          <div style={roleCard}>👩‍🏫 Öğretmen<br /><small>Öğrenci hedeflerini takip</small></div>
          <div style={roleCard}>🧑‍💼 Koç<br /><small>Genel performans izleme</small></div>
        </div>
      </section>

      <section style={{ maxWidth: '1000px', margin: '2rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '1rem' }}>🎬 Uygulama Tanıtımı</h2>
        <video
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          controls
          style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}
        />
      </section>
    </div>
  );
}

const roleCard = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  minWidth: '250px',
  textAlign: 'center',
  fontSize: '1.1rem',
  color: '#1e293b'
};
