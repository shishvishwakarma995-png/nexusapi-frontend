import { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  useApis, useCreateApi, useKeys,
  useGenerateKey, useRevokeKey, useRotateKey,
} from '../hooks/useApis';

/* ─── Badge ─────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    active:  'badge-green',
    revoked: 'badge-red',
    expired: 'badge-orange',
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}

/* ─── Usage bar ─────────────────────────────────── */
function UsageBar({ used, total }) {
  const pct   = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const color = pct > 90 ? 'var(--error)' : pct > 70 ? 'var(--warning)' : 'var(--success)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>
        <span style={{ fontWeight: 600 }}>{pct}% used</span>
        <span className="mono">{(used / 1000).toFixed(1)}k / {(total / 1000).toFixed(0)}k req/mo</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ─── Generate Key Modal ─────────────────────────── */
function GenerateKeyModal({ apis, onClose, onGenerated }) {
  const [form,  setForm]  = useState({ apiId: '', name: '', plan: 'free' });
  const [error, setError] = useState('');
  const generateKey = useGenerateKey();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await generateKey.mutateAsync(form);
      onGenerated(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate key. Try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">⚡ Generate API Key</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select API</label>
            <select
              value={form.apiId}
              onChange={e => setForm(p => ({ ...p, apiId: e.target.value }))}
              required
              className="form-input form-select"
            >
              <option value="">— Choose an API —</option>
              {apis?.map(api => (
                <option key={api._id} value={api._id}>{api.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Key name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Production Backend"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Plan</label>
            <select
              value={form.plan}
              onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}
              className="form-input form-select"
            >
              <option value="free">Free — 1,000 req/mo · 10 req/min</option>
              <option value="starter">Starter — 50,000 req/mo · 60 req/min</option>
              <option value="pro">Pro — 200,000 req/mo · 300 req/min</option>
              <option value="enterprise">Enterprise — Unlimited</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={generateKey.isPending}
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', padding: '11px' }}
          >
            {generateKey.isPending
              ? <><span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Generating...</>
              : '⚡ Generate Key'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── New Key Display Modal ──────────────────────── */
function NewKeyModal({ keyData, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(keyData.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔑</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>
            Your API Key is Ready!
          </h3>
          <div className="alert alert-warning" style={{ textAlign: 'left', marginBottom: 0 }}>
            <span>⚠</span>
            <span>Copy this key now — it will <strong>never be shown again</strong> for security reasons.</span>
          </div>
        </div>

        <div className="key-reveal">{keyData.key}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {[
            { label: 'Plan',       value: keyData.plan },
            { label: 'Rate limit', value: `${keyData.rateLimit?.requestsPerMinute} req/min` },
            { label: 'Monthly',   value: `${(keyData.rateLimit?.requestsPerMonth || 0).toLocaleString()} req` },
            { label: 'Status',    value: keyData.status },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{value}</div>
            </div>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="btn btn-primary w-full"
          style={{ justifyContent: 'center', padding: '11px', marginBottom: 10 }}
        >
          {copied ? '✅ Copied to clipboard!' : '📋 Copy API Key'}
        </button>
        <button
          onClick={onClose}
          className="btn btn-secondary w-full"
          style={{ justifyContent: 'center', padding: '10px' }}
        >
          I've saved my key — close
        </button>
      </div>
    </div>
  );
}

/* ─── Create API Modal ───────────────────────────── */
function CreateApiModal({ onClose }) {
  const [form,  setForm]  = useState({ name: '', baseUrl: '', description: '' });
  const [error, setError] = useState('');
  const createApi = useCreateApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createApi.mutateAsync(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create API');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">+ Register API</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">API name</label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. PokéAPI Proxy"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Base URL</label>
            <input
              type="url"
              value={form.baseUrl}
              onChange={e => setForm(p => ({ ...p, baseUrl: e.target.value }))}
              placeholder="https://pokeapi.co/api/v2"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="What does this API do?"
              rows={2}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>
          <button
            type="submit"
            disabled={createApi.isPending}
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', padding: '11px' }}
          >
            {createApi.isPending
              ? <><span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Creating...</>
              : '+ Create API'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Key Card ───────────────────────────────────── */
function KeyCard({ apiKey, onRevoke, onRotate, revoking, rotating }) {
  return (
    <div
      className="card"
      style={{
        opacity: apiKey.status !== 'active' ? 0.6 : 1,
        marginBottom: 12,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>
            {apiKey.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {apiKey.apiId?.name}
            {' · '}
            Created {new Date(apiKey.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            {apiKey.lastUsedAt && ` · Last used ${new Date(apiKey.lastUsedAt).toLocaleDateString()}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <StatusBadge status={apiKey.status} />
          <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>{apiKey.plan}</span>
        </div>
      </div>

      {/* Key prefix */}
      <div style={{
        background: 'var(--bg-input)', border: '1px solid var(--border)',
        borderRadius: 6, padding: '9px 13px', marginBottom: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span className="mono" style={{ fontSize: 13, color: 'var(--primary-light)' }}>{apiKey.keyPrefix}</span>
        <span style={{ color: 'var(--text-3)', fontSize: 12, letterSpacing: 2 }}>•••••••••••••••••</span>
      </div>

      {/* Usage */}
      <div style={{ marginBottom: 14 }}>
        <UsageBar
          used={apiKey.usage?.currentMonthRequests || 0}
          total={apiKey.rateLimit?.requestsPerMonth || 1000}
        />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: 12 }}>
        <span style={{ color: 'var(--text-3)' }}>
          Total: <strong style={{ color: 'var(--text-1)' }}>{(apiKey.usage?.totalRequests || 0).toLocaleString()}</strong> requests
        </span>
        <span style={{ color: 'var(--text-3)' }}>
          Rate limit: <strong style={{ color: 'var(--text-1)' }}>{apiKey.rateLimit?.requestsPerMinute}/min</strong>
        </span>
      </div>

      {/* Actions */}
      {apiKey.status === 'active' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onRotate(apiKey._id)}
            disabled={rotating}
          >
            🔄 Rotate
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onRevoke(apiKey._id)}
            disabled={revoking}
          >
            🚫 Revoke
          </button>
        </div>
      )}
      {apiKey.status === 'revoked' && (
        <div style={{ fontSize: 12, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>🚫</span>
          <span>Revoked: {apiKey.revokedReason || 'No reason provided'}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function ApiKeys() {
  const [showGenModal,  setShowGenModal]  = useState(false);
  const [showApiModal,  setShowApiModal]  = useState(false);
  const [newKeyData,    setNewKeyData]    = useState(null);
  const [selectedApiId, setSelectedApiId] = useState('');

  const { data: apis,  isLoading: apisLoading } = useApis();
  const { data: keys,  isLoading: keysLoading } = useKeys(selectedApiId || undefined);
  const revokeKey = useRevokeKey();
  const rotateKey = useRotateKey();

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke this key? This action cannot be undone.')) return;
    try { await revokeKey.mutateAsync({ id, reason: 'Manually revoked by owner' }); }
    catch (err) { alert('Revoke failed: ' + (err.response?.data?.message || 'Error')); }
  };

  const handleRotate = async (id) => {
    if (!window.confirm('Rotate this key? The old key will be immediately revoked.')) return;
    try {
      const { data } = await rotateKey.mutateAsync(id);
      setNewKeyData(data.data);
    } catch (err) { alert('Rotate failed: ' + (err.response?.data?.message || 'Error')); }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrap">

          {/* Modals */}
          {showApiModal  && <CreateApiModal  onClose={() => setShowApiModal(false)} />}
          {showGenModal  && <GenerateKeyModal apis={apis} onClose={() => setShowGenModal(false)} onGenerated={d => { setShowGenModal(false); setNewKeyData(d); }} />}
          {newKeyData    && <NewKeyModal keyData={newKeyData} onClose={() => setNewKeyData(null)} />}

          {/* Header */}
          <div className="page-header">
            <div className="page-title-wrap">
              <h1 className="page-title">APIs & Keys</h1>
              <p className="page-subtitle">Register your APIs, generate and manage access keys</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setShowApiModal(true)}>+ Register API</button>
              <button className="btn btn-primary"   onClick={() => setShowGenModal(true)}>⚡ Generate Key</button>
            </div>
          </div>

          {/* API chips */}
          {!apisLoading && apis && apis.length > 0 && (
            <div className="chip-list" style={{ marginBottom: 20 }}>
              <button
                className={`chip${!selectedApiId ? ' active' : ''}`}
                onClick={() => setSelectedApiId('')}
              >
                All Keys
              </button>
              {apis.map(api => (
                <button
                  key={api._id}
                  className={`chip${selectedApiId === api._id ? ' active' : ''}`}
                  onClick={() => setSelectedApiId(api._id)}
                >
                  {api.name}
                  {api.activeKeyCount > 0 && (
                    <span style={{ marginLeft: 5, fontSize: 10, background: 'rgba(99,102,241,0.2)', padding: '1px 5px', borderRadius: 10 }}>
                      {api.activeKeyCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Keys list */}
          {keysLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <span className="spinner" style={{ width: 28, height: 28 }} />
            </div>
          ) : !keys || keys.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">🔑</div>
                <p className="empty-title">No API keys yet</p>
                <p className="empty-sub">
                  {apis && apis.length === 0
                    ? 'First register an API, then generate a key for it'
                    : 'Generate a key to start routing traffic through the gateway'}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => apis && apis.length === 0 ? setShowApiModal(true) : setShowGenModal(true)}
                >
                  {apis && apis.length === 0 ? '+ Register your first API' : '⚡ Generate API Key'}
                </button>
              </div>
            </div>
          ) : (
            keys.map(key => (
              <KeyCard
                key={key._id}
                apiKey={key}
                onRevoke={handleRevoke}
                onRotate={handleRotate}
                revoking={revokeKey.isPending}
                rotating={rotateKey.isPending}
              />
            ))
          )}

        </div>
      </main>
    </div>
  );
}