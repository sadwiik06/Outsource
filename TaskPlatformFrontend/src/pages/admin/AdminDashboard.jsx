import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import '../Dashboard.css';

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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-8 bg-neutral-200 rounded-full mb-4"></div>
        <div className="text-neutral-400 font-medium">Loading analytics...</div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, prefix = "" }) => (
    <div className="card stat-card">
      <h3 className="stat-card-title">{title}</h3>
      <div className="stat-card-value">
        {prefix}{value}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-title">
          <h2 className="heading-1 !mb-0">Admin Dashboard</h2>
          <p className="dashboard-header-text">Overview of platform metrics and management tools.</p>
        </div>
      </div>

      {dashboard && (
        <div className="dashboard-section">
          <h3 className="heading-2">System Metrics</h3>
          <div className="stats-grid">
            <StatCard title="Total Users" value={dashboard.total_users} />
            <StatCard title="Total Tasks" value={dashboard.total_tasks} />
            <StatCard title="Completed Tasks" value={dashboard.completed_tasks} />
            <StatCard title="Disputed Tasks" value={dashboard.disputed_tasks} />
            <StatCard title="Total Payments" value={dashboard.total_payments_count} />
            <StatCard title="Total Volume" value={dashboard.total_payments_amount} prefix="$" />
          </div>
        </div>
      )}

      <div className="dashboard-section pt-6 border-t border-neutral-200">
        <h3 className="heading-2">Quick Access</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Users", to: "/admin/users" },
            { label: "Tasks", to: "/admin/tasks" },
            { label: "Payments", to: "/admin/payments" },
            { label: "Performance", to: "/admin/performance" },
            { label: "Audits", to: "/admin/audits" }
          ].map((item, idx) => (
            <Link key={idx} to={item.to} className="card hover:shadow-md hover:border-neutral-300 transition-all flex items-center justify-center p-4 text-center font-medium text-neutral-900">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
