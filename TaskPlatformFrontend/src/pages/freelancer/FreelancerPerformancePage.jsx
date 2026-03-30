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

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>My Performance</h2>
            <p className="dashboard-header-text">Your overall platform metrics and statistics.</p>
          </div>
        </div>

        {performance ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-title">Completed Tasks</div>
                <div className="stat-card-value">{performance.completedTasks ?? 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Success Rate</div>
                <div className="stat-card-value">{(performance.successRate ?? 0).toFixed(1)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Total Earnings</div>
                <div className="stat-card-value" style={{ color: 'var(--accent-3)' }}>
                  ${(performance.totalEarnings ?? 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="freelancer-grid">
              <div className="freelancer-info-card">
                <div className="freelancer-info-card-label">Average Rating</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span className="freelancer-info-card-value">
                    {performance.averageRating > 0 ? (performance.averageRating).toFixed(1) : 'N/A'}
                  </span>
                  {performance.averageRating > 0 && (
                    <span style={{ fontSize: '22px', color: '#f59e0b', lineHeight: 1 }}>★</span>
                  )}
                </div>
              </div>

              <div className="freelancer-info-card">
                <div className="freelancer-info-card-label">On-Time Delivery</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span className="freelancer-info-card-value">{(performance.responseTime ?? 0).toFixed(1)}</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink-3)', fontFamily: 'var(--font-b)', fontWeight: 400 }}>%</span>
                </div>
              </div>

              {performance.performanceLevel && (
                <div className="freelancer-info-card">
                  <div className="freelancer-info-card-label">Performance Level</div>
                  <div style={{ marginTop: '8px' }}>
                    <span className={`freelancer-status-badge ${
                      performance.performanceLevel === 'GOLD'   ? 'status-paid' :
                      performance.performanceLevel === 'SILVER' ? 'status-funded' :
                      performance.performanceLevel === 'BRONZE' ? 'status-submitted' :
                      'status-rejected'
                    }`}>
                      {performance.performanceLevel === 'GOLD'   ? '🥇 GOLD' :
                       performance.performanceLevel === 'SILVER' ? '🥈 SILVER' :
                       performance.performanceLevel === 'BRONZE' ? '🥉 BRONZE' :
                       '⚠️ NEEDS IMPROVEMENT'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="freelancer-empty-state">No performance data available.</div>
        )}

      </div>
    </div>
  );
};