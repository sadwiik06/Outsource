import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import '../Dashboard.css';
import './Freelancer.css';

export const FreelancerPerformancePage = () => {
  const { user }          = useContext(AuthContext);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => { fetchPerformance(); }, []);

  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/freelancer/performance/${user.id}`);
      setPerformance(res.data);
    } catch {
      setError('Failed to fetch performance data');
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dash-loading">Loading performance data...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="freelancer-empty-state" style={{ color: 'var(--red)' }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>My Performance</h2>
            <p className="dashboard-header-text">Your overall platform metrics and statistics.</p>
          </div>
        </div>

        {performance ? (
          <>
            {/* Top stat row — big numbers */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-title">Completed Tasks</div>
                <div className="stat-card-value">{performance.completedTasks}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Success Rate</div>
                <div className="stat-card-value">{performance.successRate}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Total Earnings</div>
                <div className="stat-card-value" style={{ color: 'var(--accent-3)' }}>
                  ${performance.totalEarnings}
                </div>
              </div>
            </div>

            {/* Secondary metrics */}
            <div className="freelancer-grid">
              <div className="freelancer-info-card">
                <div className="freelancer-info-card-label">Average Rating</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span className="freelancer-info-card-value">{performance.averageRating}</span>
                  <span style={{ fontSize: '22px', color: '#f59e0b', lineHeight: 1 }}>★</span>
                </div>
              </div>

              <div className="freelancer-info-card">
                <div className="freelancer-info-card-label">Avg. Response Time</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span className="freelancer-info-card-value">{performance.responseTime}</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink-3)', fontFamily: 'var(--font-b)', fontWeight: 400 }}>hrs</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="freelancer-empty-state">No performance data available.</div>
        )}

      </div>
    </div>
  );
};