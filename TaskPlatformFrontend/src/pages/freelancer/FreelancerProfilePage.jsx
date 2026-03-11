import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import './Freelancer.css';

export const FreelancerProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/freelancer/profile/${user.id}`);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
    }
    setLoading(false);
  };

  if (loading) return <div className="freelancer-container"><div className="freelancer-empty-state">Loading profile...</div></div>;
  if (error) return <div className="freelancer-container"><div className="freelancer-empty-state text-red-600">{error}</div></div>;

  return (
    <div className="freelancer-container">
      <div className="freelancer-header">
        <h2>My Profile</h2>
        <p>Manage your professional details and account status.</p>
      </div>

      {profile ? (
        <div className="freelancer-grid">
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Email</div>
            <div className="freelancer-info-card-value font-normal">{profile.email}</div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Name</div>
            <div className="freelancer-info-card-value font-normal">{profile.name || 'Not provided'}</div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Skills</div>
            <div className="freelancer-info-card-value font-normal">{profile.skills || 'Not specified'}</div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Rating</div>
            <div className="freelancer-info-card-value">{profile.rating || 'N/A'} <span className="text-yellow-500 text-lg">★</span></div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Status</div>
            <div className="mt-1">
              <span className={`freelancer-status-badge ${profile.status === 'ACTIVE' ? 'status-paid' : 'status-default'}`}>
                {profile.status}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="freelancer-empty-state">No profile information available.</div>
      )}
    </div>
  );
};
