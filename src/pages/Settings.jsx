import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Settings() {
  const { user, checkAuth } = useAuth();
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const updateData = { name: form.name, email: form.email };
      if (form.password) updateData.password = form.password; // Only send password if user typed one
      
      const { data } = await api.put('/auth/me', updateData);
      setMessage(data.message || 'Profile updated successfully!');
      if (form.password) setForm(prev => ({ ...prev, password: '' })); // Clear password field
      await checkAuth(); // Refresh user data in context
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrap" style={{ maxWidth: 700 }}>
          
          <div className="page-header" style={{ marginBottom: 30 }}>
            <div className="page-title-wrap">
              <h1 className="page-title">Profile Settings</h1>
              <p className="page-subtitle">Update your account details and password</p>
            </div>
          </div>

          <div className="card">
            {message && <div className="alert alert-success"><span>✅</span> {message}</div>}
            {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="divider" style={{ margin: '30px 0' }} />

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  className="form-input"
                  minLength={6}
                />
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>
                  Must be at least 6 characters and contain a number.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ minWidth: 140, justifyContent: 'center' }}
                >
                  {isSubmitting ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
