import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import '../Dashboard.css';
import './Admin.css';

const getPerfBadge = (level) => ({
  GOLD:   'perf-high',
  SILVER: 'perf-medium',
  BRONZE: 'perf-low',
  RISK:   'perf-low',
})[level] || 'perf-default';

const getPerfLabel = (level) => {
  if (!level || level === 'N/A') return 'N/A';
  return level.charAt(0) + level.slice(1).toLowerCase();
};

export const PerformanceAnalyticsPage = () => {
  const [performances, setPerformances]   = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [riskUsers, setRiskUsers]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [activeTab, setActiveTab]         = useState('top');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [allRes, topRes, riskRes] = await Promise.all([
        api.get('/admin/performance/all'),
        api.get('/admin/performance/top/10'),
        api.get('/admin/performance/risk'),
      ]);
      setPerformances(allRes.data);
      setTopPerformers(topRes.data);
      setRiskUsers(riskRes.data);
    } catch { setError('Failed to fetch performance data'); }
    setLoading(false);
  };

  const TABS = [
    { id: 'top',  label: 'Top Performers', count: topPerformers.length },
    { id: 'risk', label: 'Risk Users',      count: riskUsers.length },
    { id: 'all',  label: 'All Records',     count: performances.length },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Performance Analytics</h2>
            <p className="dashboard-header-text">Freelancer scores, top performers, and risk analysis.</p>
          </div>
        </div>

        {!loading && !error && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-title">Total Records</div>
              <div className="stat-card-value">{performances.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Top Performers</div>
              <div className="stat-card-value" style={{ color: 'var(--accent-3)' }}>{topPerformers.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">At Risk</div>
              <div className="stat-card-value" style={{ color: 'var(--red)' }}>{riskUsers.length}</div>
            </div>
          </div>
        )}

        <div style={{
          display: 'flex', gap: '0',
          border: '2px solid var(--border)', borderRadius: 'var(--r)',
          overflow: 'hidden', width: 'fit-content',
          boxShadow: 'var(--shadow-brut)',
        }}>
          {TABS.map((tab, i) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 20px',
                fontFamily: 'var(--font-d)', fontSize: '13px', fontWeight: 700,
                color: activeTab === tab.id ? 'var(--white)' : 'var(--ink-2)',
                background: activeTab === tab.id ? 'var(--ink)' : 'var(--white)',
                border: 'none',
                borderRight: i < TABS.length - 1 ? '2px solid var(--border)' : 'none',
                cursor: 'pointer',
                transition: 'background var(--trans), color var(--trans)',
                display: 'flex', alignItems: 'center', gap: '7px',
              }}>
              {tab.label}
              <span style={{
                fontFamily: 'var(--font-d)', fontSize: '10px', fontWeight: 800,
                padding: '1px 7px', borderRadius: '100px',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--paper)',
                color: activeTab === tab.id ? 'var(--white)' : 'var(--ink-3)',
                border: activeTab === tab.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border-light)',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? <div className="dash-loading">Loading performance data...</div>
          : error ? <div className="empty-state" style={{ color: 'var(--red)' }}>{error}</div>
          : (
          <div className="table-container">
            {activeTab === 'top' && (
              <table className="dash-table">
                <thead><tr><th>User ID</th><th>Success Rate (%)</th><th>Level</th><th>Completed Tasks</th><th>Rating</th></tr></thead>
                <tbody>
                  {topPerformers.length === 0
                    ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-3)' }}>No data</td></tr>
                    : topPerformers.map((p, i) => (
                    <tr key={p.userId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            fontFamily: 'var(--font-d)', fontSize: '11px', fontWeight: 800,
                            color: i === 0 ? '#ca8a04' : i === 1 ? 'var(--ink-3)' : i === 2 ? '#b45309' : 'var(--ink-4)',
                            width: '18px', textAlign: 'center',
                          }}>
                            #{i + 1}
                          </span>
                          <span style={{ fontWeight: 600 }}>{p.userId}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                          {p.completionRate ? p.completionRate.toFixed(1) : '0.0'}%
                        </span>
                      </td>
                      <td>
                        <span className={`perf-badge ${getPerfBadge(p.performanceLevel)}`}>{getPerfLabel(p.performanceLevel)}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.completedTasks || 0}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          {p.avgRating ? p.avgRating.toFixed(1) : '0.0'}
                          <span style={{ color: '#f59e0b' }}>★</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'risk' && (
              <table className="dash-table">
                <thead><tr><th>User ID</th><th>Score</th><th>Risk Level</th><th>Issues</th></tr></thead>
                <tbody>
                  {riskUsers.length === 0
                    ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-3)' }}>No at-risk users</td></tr>
                    : riskUsers.map(p => (
                    <tr key={p.userId}>
                      <td style={{ fontWeight: 600 }}>{p.userId}</td>
                      <td style={{ fontFamily: 'var(--font-d)', fontWeight: 800, color: 'var(--red)' }}>
                        {p.completionRate ? p.completionRate.toFixed(1) : '0.0'}%
                      </td>
                      <td><span className="perf-badge perf-low">High Risk</span></td>
                      <td style={{ fontSize: '13px', color: 'var(--ink-2)' }}>{p.issues || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'all' && (
              <table className="dash-table">
                <thead><tr><th>User ID</th><th>Success Rate (%)</th><th>Level</th><th>Tasks</th></tr></thead>
                <tbody>
                  {performances.length === 0
                    ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-3)' }}>No records</td></tr>
                    : performances.map(p => (
                    <tr key={p.userId}>
                      <td style={{ fontWeight: 600 }}>{p.userId}</td>
                      <td style={{ fontFamily: 'var(--font-d)', fontWeight: 800 }}>
                        {p.completionRate ? p.completionRate.toFixed(1) : '0.0'}%
                      </td>
                      <td><span className={`perf-badge ${getPerfBadge(p.performanceLevel)}`}>{getPerfLabel(p.performanceLevel)}</span></td>
                      <td style={{ fontWeight: 600 }}>{p.completedTasks || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
};