import { useAuth } from '../context/AuthContext';
import { useOverview, useTimeseries } from '../hooks/useAnalytics';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const METRICS = (data, loading) => [
  {
    icon: '📡',
    iconClass: 'indigo',
    label: 'Total Requests',
    value: loading ? '—' : (data?.totalRequests || 0).toLocaleString(),
    sub: 'All time',
  },
  {
    icon: '⚡',
    iconClass: 'violet',
    label: 'Requests Today',
    value: loading ? '—' : (data?.totalRequestsToday || 0).toLocaleString(),
    sub: 'Last 24 hours',
  },
  {
    icon: '✅',
    iconClass: 'green',
    label: 'Success Rate',
    value: loading ? '—' : `${data?.successRate ?? 100}%`,
    sub: 'All requests',
  },
  {
    icon: '⏱',
    iconClass: 'orange',
    label: 'Avg Latency',
    value: loading ? '—' : `${data?.avgLatency || 0}ms`,
    sub: 'Response time',
  },
  {
    icon: '🔑',
    iconClass: 'indigo',
    label: 'Active Keys',
    value: loading ? '—' : (data?.activeKeys || 0),
    sub: 'API keys',
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <p style={{ color: 'var(--text-2)', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.dataKey === 'requests' ? '▲' : '▼'} {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: timeseries, isLoading: chartLoading }  = useTimeseries(24);

  const metrics = METRICS(overview, overviewLoading);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrap">

          {/* Header */}
          <div className="page-header">
            <div className="page-title-wrap">
              <h1 className="page-title">
                Good to see you, <span style={{ color: 'var(--primary-light)' }}>{user?.name?.split(' ')[0]}</span> 👋
              </h1>
              <p className="page-subtitle">Your API gateway is running and tracking all requests</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => navigate('/logs')}>
                View Logs
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/keys')}>
                ⚡ Manage Keys
              </button>
            </div>
          </div>

          {/* Metric cards */}
          <div className="metrics-grid">
            {metrics.map(m => (
              <div key={m.label} className="metric-card">
                <div className={`metric-icon ${m.iconClass}`}>{m.icon}</div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value">{m.value}</div>
                <div className="metric-sub">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="card mb-6" style={{ marginBottom: 20 }}>
            <div className="flex justify-between items-center mb-4" style={{ marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>
                  Request Volume
                </h2>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Last 24 hours — auto-refreshes every minute</p>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-2)' }}>
                <span>
                  <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: '#6366f1', marginRight: 5 }} />
                  Requests
                </span>
                <span>
                  <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: '#ef4444', marginRight: 5 }} />
                  Errors
                </span>
              </div>
            </div>

            {chartLoading ? (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="spinner" />
              </div>
            ) : !timeseries || timeseries.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-icon">📊</div>
                <p className="empty-title">No data yet</p>
                <p className="empty-sub">Hit the gateway with your API key to see charts here</p>
                <div className="code-block" style={{ textAlign: 'left', display: 'inline-block', marginTop: 8 }}>
                  curl http://localhost:5000/gateway/YOUR_KEY/pokemon/pikachu
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={timeseries} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke="#6366f1" fill="url(#colorRequests)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="errors"   name="Errors"   stroke="#ef4444" fill="url(#colorErrors)"   strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gateway quick reference */}
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 14 }}>
              🌐 Gateway Quick Reference
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Gateway URL pattern', code: `${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000'}/gateway/<YOUR_KEY>/<path>` },
                { label: 'PokéAPI example',     code: `curl ${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000'}/gateway/YOUR_KEY/pokemon/pikachu` },
                { label: 'With header',         code: `curl -H "X-API-Key: YOUR_KEY" ${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000'}/gateway/<path>` },
                { label: 'Health check',        code: `curl ${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000'}/health` },
              ].map(({ label, code }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </div>
                  <div className="code-block" style={{ fontSize: 11.5 }}>{code}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}