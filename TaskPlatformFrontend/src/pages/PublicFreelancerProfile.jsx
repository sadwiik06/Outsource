import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientTaskService } from '../services/taskService';
import './Dashboard.css';
import './freelancer/Freelancer.css';

export const PublicFreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    clientTaskService.getFreelancerPublicProfile(id)
      .then(res => setProfile(res.data))
      .catch(err => setError(err.response?.data || 'Failed to fetch public profile'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container"><div className="dash-loading">Loading profile...</div></div>
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
        
        {/* Back */}
        <button className="btn-secondary btn-sm" style={{ width: 'fit-content', marginBottom: '16px' }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>{profile.name || profile.email}</h2>
            <p className="dashboard-header-text">Freelancer Public Profile</p>
          </div>
        </div>

        <div className="freelancer-grid">

          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Email</div>
            <div className="freelancer-info-card-value" style={{ fontSize: '18px', letterSpacing: '-0.3px', fontWeight: 600 }}>
              {profile.email}
            </div>
          </div>

          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Skills</div>
            <div className="freelancer-info-card-value" style={{ fontSize: '16px', fontWeight: 500 }}>
              {profile.skills || 'Not specified'}
            </div>
          </div>

          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Overall Rating</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="freelancer-info-card-value">{profile.rating > 0 ? profile.rating.toFixed(1) : 'N/A'}</span>
              <span style={{ fontSize: '22px', color: '#f59e0b', lineHeight: 1 }}>★</span>
            </div>
          </div>

          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Success Rate</div>
            <div className="freelancer-info-card-value" style={{ fontSize: '18px' }}>
              {profile.successRate ? profile.successRate.toFixed(1) + '%' : '100%'}
            </div>
          </div>

          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">On-Time Delivery</div>
            <div className="freelancer-info-card-value" style={{ fontSize: '18px' }}>
              {profile.onTimeDelivery ? profile.onTimeDelivery.toFixed(1) + '%' : '100%'}
            </div>
          </div>

          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Performance Level</div>
            <div style={{ marginTop: '8px' }}>
              <span className="freelancer-status-badge status-active">
                {profile.performanceLevel || 'N/A'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
