import React, { useState, useEffect } from 'react';
import api from '../../config/api';

export const PerformanceAnalyticsPage = () => {
  const [performances, setPerformances] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [riskUsers, setRiskUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const [allPerf, topPerf, riskPerf] = await Promise.all([
        api.get('/admin/performance/all'),
        api.get('/admin/performance/top/10'),
        api.get('/admin/performance/risk'),
      ]);
      setPerformances(allPerf.data);
      setTopPerformers(topPerf.data);
      setRiskUsers(riskPerf.data);
    } catch (err) {
      setError('Failed to fetch performance data');
    }
    setLoading(false);
  };

  if (loading) return <p>Loading performance data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Performance Analytics</h2>

      <div>
        <h3>Top Performers</h3>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Score</th>
              <th>Completed Tasks</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {topPerformers.map(perf => (
              <tr key={perf.userId}>
                <td>{perf.userId}</td>
                <td>{perf.score}</td>
                <td>{perf.completedTasks}</td>
                <td>{perf.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>Risk Users</h3>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Score</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {riskUsers.map(perf => (
              <tr key={perf.userId}>
                <td>{perf.userId}</td>
                <td>{perf.score}</td>
                <td>{perf.issues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>All Performance Records</h3>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Score</th>
              <th>Completed Tasks</th>
            </tr>
          </thead>
          <tbody>
            {performances.map(perf => (
              <tr key={perf.userId}>
                <td>{perf.userId}</td>
                <td>{perf.score}</td>
                <td>{perf.completedTasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
