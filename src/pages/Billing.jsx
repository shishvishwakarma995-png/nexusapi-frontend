import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    interval: 'forever',
    requests: '1,000 req / month',
    rateLimit: '10 req / min',
    description: 'Perfect for side projects and learning.',
    features: ['Community Support', 'Basic Analytics']
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$19',
    interval: 'per month',
    requests: '50,000 req / month',
    rateLimit: '60 req / min',
    description: 'For small production applications.',
    features: ['Email Support', 'Advanced Analytics']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    interval: 'per month',
    requests: '200,000 req / month',
    rateLimit: '300 req / min',
    description: 'For growing businesses and startups.',
    features: ['Priority Support', 'Custom Webhooks', 'Team Access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    interval: 'contact us',
    requests: 'Unlimited',
    rateLimit: 'Custom SLA',
    description: 'For large scale, mission-critical systems.',
    features: ['24/7 Phone Support', 'Dedicated Account Manager', 'Custom SLAs', 'On-Premise Deployment']
  }
];

export default function Billing() {
  const { user, checkAuth } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpgrade = async (planId) => {
    if (planId === user.plan) return;
    
    setLoadingPlan(planId);
    setMessage('');
    setError('');

    try {
      const { data } = await api.post('/payment/upgrade', { plan: planId });
      setMessage(data.message);
      await checkAuth(); // Refresh user data to get new plan
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrap">
          
          {/* Header */}
          <div className="page-header" style={{ marginBottom: 40 }}>
            <div className="page-title-wrap">
              <h1 className="page-title">Billing & Subscription</h1>
              <p className="page-subtitle">Manage your API usage plan and payment details</p>
            </div>
          </div>

          {message && <div className="alert alert-success" style={{ marginBottom: 24 }}><span>✅</span> {message}</div>}
          {error && <div className="alert alert-error" style={{ marginBottom: 24 }}><span>⚠</span> {error}</div>}

          {/* Current Plan Banner */}
          <div className="card" style={{ marginBottom: 32, borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>Current Plan: <span style={{ textTransform: 'capitalize', color: 'var(--primary)' }}>{user?.plan || 'free'}</span></h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)' }}>You are currently on the {user?.plan || 'free'} plan.</p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {PLANS.map(plan => {
              const isCurrent = user?.plan === plan.id;
              
              return (
                <div key={plan.id} className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', borderColor: isCurrent ? 'var(--primary)' : 'var(--border)' }}>
                  {isCurrent && (
                    <span className="badge badge-blue" style={{ position: 'absolute', top: -10, right: 20 }}>Current Plan</span>
                  )}
                  
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-3)', height: 40 }}>{plan.description}</p>
                  </div>
                  
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{plan.price}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-3)' }}> / {plan.interval}</span>
                  </div>
                  
                  <div style={{ marginBottom: 30, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-1)' }}>Includes:</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: 'var(--text-2)' }}>
                      <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--primary)' }}>✓</span> <strong>{plan.requests}</strong>
                      </li>
                      <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--primary)' }}>✓</span> {plan.rateLimit}
                      </li>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'var(--primary)' }}>✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || loadingPlan === plan.id}
                    className={`btn ${isCurrent ? 'btn-secondary' : 'btn-primary'} w-full`}
                    style={{ justifyContent: 'center', padding: '12px' }}
                  >
                    {loadingPlan === plan.id ? (
                      <><span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Processing...</>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : plan.id === 'enterprise' ? (
                      'Contact Sales'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
