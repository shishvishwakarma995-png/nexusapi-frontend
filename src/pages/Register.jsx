import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FIELDS = [
  { name: 'name',     label: 'Full name',       type: 'text',     placeholder: 'Jane Smith'         },
  { name: 'email',    label: 'Email address',   type: 'email',    placeholder: 'jane@company.com'   },
  { name: 'password', label: 'Password',        type: 'password', placeholder: '6+ characters'       },
];

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name  || form.name.length < 2)         e.name     = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6)   e.password = 'Password must be at least 6 characters';
    if (form.password && !/\d/.test(form.password))  e.password = 'Password must contain at least one number';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }

    setLoading(true);
    setErrors({});
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">⚡</div>
            <span className="auth-logo-text">NexusAPI</span>
          </div>

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Free forever — no credit card required</p>

          {errors.general && (
            <div className="alert alert-error"><span>⚠</span> {errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            {FIELDS.map(({ name, label, type, placeholder }) => (
              <div key={name} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  id={`register-${name}`}
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`form-input${errors[name] ? ' has-error' : ''}`}
                />
                {errors[name] && <div className="form-error">{errors[name]}</div>}
              </div>
            ))}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ marginTop: 8, justifyContent: 'center', padding: '12px' }}
            >
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</>
                : 'Create free account →'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['✓ Instant API keys', '✓ Request logging', '✓ Usage analytics'].map(f => (
            <span key={f} style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}