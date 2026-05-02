import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { icon: '▦', label: 'Dashboard',  path: '/dashboard' },
  { icon: '⚡', label: 'APIs & Keys', path: '/keys' },
  { icon: '📋', label: 'Request Logs', path: '/logs' },
  { icon: '💳', label: 'Billing', path: '/billing' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-logo-icon">⚡</div>
        <span className="sidebar-logo-text">NexusAPI</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV_LINKS.map(({ icon, label, path }) => (
          <button
            key={path}
            className={`nav-item${pathname === path ? ' active' : ''}`}
            onClick={() => navigate(path)}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}

        <div className="nav-section-label" style={{ marginTop: 12 }}>Resources</div>
        <a
          className="nav-item"
          href="https://pokeapi.co"
          target="_blank"
          rel="noreferrer"
        >
          <span className="nav-icon">🌐</span>
          Test APIs
        </a>
        <a
          className="nav-item"
          href={process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/health` : 'http://localhost:5000/health'}
          target="_blank"
          rel="noreferrer"
        >
          <span className="nav-icon">❤️</span>
          Health Check
        </a>
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </div>
            <div className="user-plan">{user?.plan || 'free'} plan</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>↩</span> Sign out
        </button>
      </div>
    </aside>
  );
}
