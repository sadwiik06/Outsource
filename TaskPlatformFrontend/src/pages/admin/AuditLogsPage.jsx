import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import '../Dashboard.css';
import './Admin.css';

const getAuditDot = (action = '') => {
  const a = action.toUpperCase();
  if (a.includes('CREATE') || a.includes('ADD'))    return 'audit-dot-create';
  if (a.includes('UPDATE') || a.includes('EDIT'))   return 'audit-dot-update';
  if (a.includes('DELETE') || a.includes('REMOVE')) return 'audit-dot-delete';
  if (a.includes('LOGIN')  || a.includes('AUTH'))   return 'audit-dot-auth';
  return 'audit-dot-default';
};

const fmt = (ts) => {
  if (!ts) return '—';
  try { return new Date(ts).toLocaleString(); } catch { return ts; }
};

export const AuditLogsPage = () => {
  const [logs, setLogs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [filterType, setFilterType]   = useState('all');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => { fetchLogs(); }, [filterType, filterValue]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let res;
      if (filterType === 'user'   && filterValue) res = await api.get(`/admin/audits/user/${filterValue}`);
      else if (filterType === 'action' && filterValue) res = await api.get(`/admin/audits/action/${filterValue}`);
      else res = await api.get('/admin/audits');
      setLogs(res.data);
    } catch { setError('Failed to fetch audit logs'); }
    setLoading(false);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Audit Logs</h2>
            <p className="dashboard-header-text">Full history of system events and user actions.</p>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end',
          padding: '16px 20px',
          background: 'var(--white)', border: '2px solid var(--border)',
          borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-brut)',
        }}>
          <div className="dash-field" style={{ marginBottom: 0, minWidth: '160px' }}>
            <label className="dash-label">Filter by</label>
            <select className="dash-select" value={filterType}
              onChange={e => { setFilterType(e.target.value); setFilterValue(''); }}>
              <option value="all">All logs</option>
              <option value="user">User ID</option>
              <option value="action">Action</option>
            </select>
          </div>
          {(filterType === 'user' || filterType === 'action') && (
            <div className="dash-field" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
              <label className="dash-label">{filterType === 'user' ? 'User ID' : 'Action keyword'}</label>
              <input type="text" className="dash-input"
                placeholder={filterType === 'user' ? 'Enter user ID…' : 'e.g. LOGIN, CREATE…'}
                value={filterValue} onChange={e => setFilterValue(e.target.value)} />
            </div>
          )}
        </div>

        {loading ? <div className="dash-loading">Loading audit logs...</div>
          : error   ? <div className="empty-state" style={{ color: 'var(--red)' }}>{error}</div>
          : logs.length === 0 ? <div className="empty-state">No audit logs found.</div>
          : (
          <div className="table-container">
            {logs.map(log => (
              <div key={log.id} className="audit-row">
                <div className={`audit-dot ${getAuditDot(log.action)}`} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="audit-action">{log.action}</div>
                  <div className="audit-meta">
                    <span style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: 'var(--ink-2)' }}>#{log.id}</span>
                    {log.userId && <> · User <span style={{ fontWeight: 600 }}>{log.userId}</span></>}
                    {log.details && <> · {log.details}</>}
                  </div>
                </div>
                <div className="audit-time">{fmt(log.timestamp)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};