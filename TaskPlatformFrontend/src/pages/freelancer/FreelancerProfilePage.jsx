import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import '../Dashboard.css';
import './Freelancer.css';

export const FreelancerProfilePage = () => {
  const { user }    = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', skills: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/freelancer/profile/${user.id}`);
      setProfile(res.data);
      setEditData({ name: res.data.name || '', skills: res.data.skills || '' });
    } catch {
      setError('Failed to fetch profile');
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dash-loading">Loading profile...</div>
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
            <h2>My Profile</h2>
            <p className="dashboard-header-text">Manage your professional details and account status.</p>
          </div>
        </div>

        {profile ? (
          <div className="freelancer-grid">

            <div className="freelancer-info-card">
              <div className="freelancer-info-card-label">Email</div>
              <div className="freelancer-info-card-value" style={{ fontSize: '18px', letterSpacing: '-0.3px', fontWeight: 600 }}>
                {profile.email}
              </div>
            </div>

            <div className="freelancer-info-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="freelancer-info-card-label">Name</div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '12px' }}>
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editData.name} 
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={{ width: '100%', marginTop: '8px', padding: '6px' }} 
                  placeholder="Your full name"
                />
              ) : (
                <div className="freelancer-info-card-value" style={{ fontSize: '22px' }}>
                  {profile.name || '—'}
                </div>
              )}
            </div>

            <div className="freelancer-info-card" style={{ gridColumn: isEditing ? '1 / -1' : 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="freelancer-info-card-label">Skills</div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '12px' }}>
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editData.skills} 
                  onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                  style={{ width: '100%', marginTop: '8px', padding: '6px' }} 
                  placeholder="e.g. React, Java, UI/UX"
                />
              ) : (
                <div className="freelancer-info-card-value" style={{ fontSize: '16px', fontWeight: 500, letterSpacing: 0 }}>
                  {profile.skills || 'Not specified'}
                </div>
              )}
            </div>

            {isEditing && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  className="btn-primary" 
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await api.put(`/freelancer/profile/${user.id}`, editData);
                      await fetchProfile();
                      setIsEditing(false);
                    } catch (err) {
                      alert('Failed to update profile');
                    }
                    setSaving(false);
                  }}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button className="btn-secondary" onClick={() => { setIsEditing(false); setEditData({ name: profile.name || '', skills: profile.skills || '' }); }}>
                  Cancel
                </button>
              </div>
            )}

            <div className="freelancer-info-card">
              <div className="freelancer-info-card-label">Rating</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span className="freelancer-info-card-value">{profile.rating ?? 'N/A'}</span>
                <span style={{ fontSize: '22px', color: '#f59e0b', lineHeight: 1 }}>★</span>
              </div>
            </div>

            <div className="freelancer-info-card">
              <div className="freelancer-info-card-label">Account Status</div>
              <div style={{ marginTop: '8px' }}>
                <span className={`freelancer-status-badge ${profile.status === 'ACTIVE' ? 'status-active' : 'status-default'}`}>
                  {profile.status}
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="freelancer-empty-state">No profile information available.</div>
        )}

      </div>
    </div>
  );
};