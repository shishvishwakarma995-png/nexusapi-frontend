import { useState } from 'react';
import { useLogs } from '../hooks/useAnalytics';
import Navbar from '../components/Navbar';

/* ─── Status badge ───────────────────────────────── */
function StatusBadge({ code }) {
  const [cls, label] =
    code < 300 ? ['badge-green',  code] :
    code < 400 ? ['badge-blue',   code] :
    code < 500 ? ['badge-orange', code] :
                 ['badge-red',    code];
  return (
    <span className={`badge mono ${cls}`} style={{ fontSize: 11.5, letterSpacing: '0.5px' }}>
      {label}
    </span>
  );
}

/* ─── Method badge ───────────────────────────────── */
const METHOD_CLASSES = {
  GET:    'badge-blue',
  POST:   'badge-green',
  DELETE: 'badge-red',
  PUT:    'badge-orange',
  PATCH:  'badge-gray',
};

function MethodBadge({ method }) {
  return (
    <span
      className={`badge mono ${METHOD_CLASSES[method] || 'badge-gray'}`}
      style={{ fontSize: 10.5, minWidth: 48, justifyContent: 'center', letterSpacing: '0.5px' }}
    >
      {method}
    </span>
  );
}

/* ─── Latency coloring ───────────────────────────── */
function latencyColor(ms) {
  if (ms > 1000) return 'var(--error)';
  if (ms > 500)  return 'var(--warning)';
  return 'var(--text-3)';
}

/* ─── Main page ──────────────────────────────────── */
export default function Logs() {
  const [filter, setFilter] = useState('all');
  const [page,   setPage]   = useState(1);

  const params = {
    page,
    limit: 30,
    ...(filter === 'errors'  ? { status: 'errors'  } : {}),
    ...(filter === 'success' ? { status: 'success' } : {}),
  };

  const { data, isLoading, isFetching } = useLogs(params);
  const logs       = data?.logs       || [];
  const total      = data?.total      || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <div className="page-wrap">

          {/* Header */}
          <div className="page-header">
            <div className="page-title-wrap">
              <h1 className="page-title">Request Logs</h1>
              <p className="page-subtitle">
                <span
                  className="status-dot"
                  style={{
                    display: 'inline-block',
                    width: 7, height: 7,
                    borderRadius: '50%',
                    background: isFetching ? 'var(--warning)' : 'var(--success)',
                    marginRight: 7,
                    verticalAlign: 'middle',
                    boxShadow: isFetching ? '0 0 6px var(--warning)' : '0 0 6px var(--success)',
                  }}
                />
                {isFetching ? 'Refreshing...' : 'Live'} — auto-refreshes every 10s
              </p>
            </div>

            {/* Filter tabs */}
            <div className="filter-tabs">
              {['all', 'success', 'errors'].map(f => (
                <button
                  key={f}
                  className={`filter-tab${filter === f ? ' active' : ''}`}
                  onClick={() => { setFilter(f); setPage(1); }}
                  style={{ textTransform: 'capitalize' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Total logs',    val: total.toLocaleString() },
              { label: 'This page',     val: logs.length },
              { label: 'Pages',         val: `${page} / ${totalPages}` },
              { label: 'Filter',        val: filter },
            ].map(({ label, val }) => (
              <div
                key={label}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '9px 16px', fontSize: 13,
                }}
              >
                <span style={{ color: 'var(--text-3)' }}>{label}: </span>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--text-1)' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <span className="spinner" style={{ width: 28, height: 28 }} />
            </div>
          ) : logs.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p className="empty-title">No logs yet</p>
                <p className="empty-sub">
                  {filter !== 'all'
                    ? `No ${filter} requests found. Try changing the filter.`
                    : 'Hit the gateway with your API key to see requests here'}
                </p>
                {filter === 'all' && (
                  <div className="code-block" style={{ display: 'inline-block', marginTop: 8, textAlign: 'left' }}>
                    curl http://localhost:5000/gateway/YOUR_KEY/pokemon/pikachu
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="table-wrap" style={{ marginBottom: 16 }}>
              {/* Table header */}
              <div className="table-head-row">
                <span style={{ flex: '0 0 58px' }}>Status</span>
                <span style={{ flex: '0 0 64px' }}>Method</span>
                <span style={{ flex: 1 }}>Endpoint</span>
                <span style={{ flex: '0 0 140px' }}>API Key</span>
                <span style={{ flex: '0 0 80px', textAlign: 'right' }}>Latency</span>
                <span style={{ flex: '0 0 75px', textAlign: 'right' }}>Time</span>
              </div>

              {logs.map((log, i) => (
                <div
                  key={log._id}
                  className="table-row"
                  style={{
                    background: log.statusCode >= 400 ? 'rgba(239,68,68,0.03)' : undefined,
                    borderBottom: i < logs.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  }}
                >
                  <span style={{ flex: '0 0 58px' }}>
                    <StatusBadge code={log.statusCode} />
                  </span>
                  <span style={{ flex: '0 0 64px' }}>
                    <MethodBadge method={log.method} />
                  </span>
                  <span
                    className="mono"
                    style={{
                      flex: 1, fontSize: 12.5, color: 'var(--text-1)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                    title={log.endpoint}
                  >
                    {log.endpoint}
                  </span>
                  <span
                    className="mono"
                    style={{ flex: '0 0 140px', fontSize: 11.5, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={log.apiKeyId?.keyPrefix}
                  >
                    {log.apiKeyId?.keyPrefix || '—'}
                  </span>
                  <span
                    className="mono"
                    style={{
                      flex: '0 0 80px', textAlign: 'right',
                      fontSize: 12.5, fontWeight: log.latency > 500 ? 700 : 400,
                      color: latencyColor(log.latency),
                    }}
                  >
                    {log.latency}ms
                  </span>
                  <span
                    className="mono"
                    style={{ flex: '0 0 75px', textAlign: 'right', fontSize: 11, color: 'var(--text-3)' }}
                  >
                    {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}