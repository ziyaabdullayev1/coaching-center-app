import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.logo}>🎓 Coaching Center</div>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/dashboard/student" style={styles.link}>Dashboard</Link>
          <Link to="/dashboard/teacher" style={styles.link}>Teacher</Link>
          <Link to="/dashboard/coach" style={styles.link}>Coach</Link>
        </div>
        <div style={styles.auth}> 
          <Link to="/login"><button style={styles.button}>Login</button></Link>
          <Link to="/signup"><button style={{ ...styles.button, ...styles.primary }}>Sign Up</button></Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'opacity 0.2s',
  },
  auth: {
    display: 'flex',
    gap: '0.5rem',
  },
  button: {
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  primary: {
    background: '#fff',
    color: '#2563eb',
    border: 'none',
  }
};
