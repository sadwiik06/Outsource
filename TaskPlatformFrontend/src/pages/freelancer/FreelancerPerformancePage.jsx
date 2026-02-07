import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

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

  if (loading) return <p>Loading performance data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Performance</h2>
      {performance && (
        <div>
          <p>Completed Tasks: {performance.completedTasks}</p>
          <p>Average Rating: {performance.averageRating}</p>
          <p>Total Earnings: ${performance.totalEarnings}</p>
          <p>Response Time: {performance.responseTime} hours</p>
          <p>Success Rate: {performance.successRate}%</p>
        </div>
      )}
    </div>
  );
};
