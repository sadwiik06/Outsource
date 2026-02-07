import React, { useState, useEffect } from 'react';
import api from '../../config/api';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [filterType, filterValue]);

  const fetchLogs = async () => {
    try {
      let response;
      if (filterType === 'user' && filterValue) {
        response = await api.get(`/admin/audits/user/${filterValue}`);
      } else if (filterType === 'action' && filterValue) {
        response = await api.get(`/admin/audits/action/${filterValue}`);
      } else {
        response = await api.get('/admin/audits');
      }
      setLogs(response.data);
    } catch (err) {
      setError('Failed to fetch audit logs');
    }
    setLoading(false);
  };

  if (loading) return <p>Loading audit logs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Audit Logs</h2>
      
      <div>
        <div>
          <label>Filter by:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All</option>
            <option value="user">User ID</option>
            <option value="action">Action</option>
          </select>
        </div>
        {(filterType === 'user' || filterType === 'action') && (
          <input
            type="text"
            placeholder={filterType === 'user' ? 'Enter User ID' : 'Enter Action'}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Action</th>
            <th>Timestamp</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.userId}</td>
              <td>{log.action}</td>
              <td>{log.timestamp}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
