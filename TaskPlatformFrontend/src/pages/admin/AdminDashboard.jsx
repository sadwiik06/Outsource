import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import '../Dashboard.css';
import './Admin.css';

const NAV_ITEMS = [
  { label: 'Users',       icon: '◉', to: '/admin/users'       },
  // { label: 'Tasks',       icon: '◈', to: '/admin/tasks'       },
  { label: 'Payments',    icon: '⊛', to: '/admin/payments'    },
  { label: 'Performance', icon: '◬', to: '/admin/performance' },
  { label: 'Audit Logs',  icon: '⌗', to: '/admin/audits'      },
];

export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/analytics/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard');
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dash-loading">Loading analytics...</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Admin Dashboard</h2>
            <p className="dashboard-header-text">
              Platform-wide metrics, user management, and system oversight.
            </p>
          </div>
        </div>

        {dashboard && (
          <section>
            <div className="section-title">System Metrics</div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-title">Total Users</div>
                <div className="stat-card-value">{dashboard.total_users ?? 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Total Tasks</div>
                <div className="stat-card-value">{dashboard.total_tasks ?? 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Completed</div>
                <div className="stat-card-value" style={{ color: 'var(--accent-3)' }}>
                  {dashboard.completed_tasks ?? 0}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Disputed</div>
                <div className="stat-card-value" style={{ color: 'var(--red)' }}>
                  {dashboard.disputed_tasks ?? 0}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Total Payments</div>
                <div className="stat-card-value">{dashboard.total_payments_count ?? 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Payment Volume</div>
                <div className="stat-card-value" style={{ color: 'var(--accent-3)' }}>
                  ${dashboard.total_payments_amount ?? 0}
                </div>
              </div>
            </div>
          </section>
        )}

        <hr className="admin-section-divider" />

        <section>
          <div className="section-title">Quick Access</div>
          <div className="admin-nav-grid">
            {NAV_ITEMS.map(item => (
              <Link key={item.to} to={item.to} className="admin-nav-card">
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};