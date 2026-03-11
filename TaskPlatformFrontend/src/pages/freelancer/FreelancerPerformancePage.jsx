import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import './Freelancer.css';

export const FreelancerPerformancePage = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const response = await api.get(`/freelancer/performance/${user.id}`);
      setPerformance(response.data);
    } catch (err) {
      setError('Failed to fetch performance data');
    }
    setLoading(false);
  };

  if (loading) return <div className="freelancer-container"><div className="freelancer-empty-state">Loading performance data...</div></div>;
  if (error) return <div className="freelancer-container"><div className="freelancer-empty-state text-red-600">{error}</div></div>;

  return (
    <div className="freelancer-container">
      <div className="freelancer-header">
        <h2>My Performance</h2>
        <p>Your overall platform metrics and statistics.</p>
      </div>

      {performance ? (
        <div className="freelancer-grid">
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Completed Tasks</div>
            <div className="freelancer-info-card-value text-3xl">{performance.completedTasks}</div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Average Rating</div>
            <div className="freelancer-info-card-value text-3xl">{performance.averageRating} <span className="text-yellow-500 text-2xl">★</span></div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Total Earnings</div>
            <div className="freelancer-info-card-value text-3xl text-emerald-600">${performance.totalEarnings}</div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Response Time</div>
            <div className="freelancer-info-card-value text-3xl">{performance.responseTime} <span className="text-base text-neutral-500 font-normal">hours</span></div>
          </div>
          <div className="freelancer-info-card">
            <div className="freelancer-info-card-label">Success Rate</div>
            <div className="freelancer-info-card-value text-3xl">{performance.successRate}%</div>
          </div>
        </div>
      ) : (
        <div className="freelancer-empty-state">No performance data available.</div>
      )}
    </div>
  );
};
