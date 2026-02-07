import React, { useState, useEffect } from 'react';
import api from '../../config/api';

export const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/analytics/dashboard');
      setDashboard(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard');
    }
    setLoading(false);
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {dashboard && (
        <div>
          <div>
            <h3>System Statistics</h3>
            <p>Total Users: {dashboard.total_users}</p>
            <p>Total Tasks: {dashboard.total_tasks}</p>
            <p>Completed Tasks: {dashboard.completed_tasks}</p>
            <p>Disputed Tasks: {dashboard.disputed_tasks}</p>
            <p>Total Payments: {dashboard.total_payments_count}</p>
            <p>Total Amount: ${dashboard.total_payments_amount}</p>
          </div>
        </div>
      )}

      <nav>
        <a href="/admin/users">User Management</a>
        <a href="/admin/tasks">Task Management</a>
        <a href="/admin/payments">Payment Management</a>
        <a href="/admin/performance">Performance Analytics</a>
        <a href="/admin/audits">Audit Logs</a>
      </nav>
    </div>
  );
};
