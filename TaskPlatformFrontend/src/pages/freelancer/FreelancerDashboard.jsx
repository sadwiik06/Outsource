import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import '../Dashboard.css';
import './Freelancer.css';

export const FreelancerDashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionUrls, setSubmissionUrls] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchStatsTasksAndMilestones();
    }
  }, [user?.id]);

  const fetchStatsTasksAndMilestones = async () => {
    try {
      const statsRes = await api.get(`/freelancer/stats/${user.id}`);
      setStats(statsRes.data);
      const tasksRes = await api.get(`/freelancer/tasks/${user.id}`);
      setTasks(tasksRes.data);
      const milestoneRes = await api.get(`/freelancer/milestones/${user.id}`);
      setMilestones(milestoneRes.data);

      const urls = {};
      milestoneRes.data.forEach(m => {
        urls[m.id] = m.submissionUrl || '';
      });
      setSubmissionUrls(urls);
      refreshUser(); // Sync balance automatically
    } catch (err) {
      console.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const actionableMilestones = milestones.filter(m => ['SUGGESTED', 'FUNDED', 'REJECTED', 'CREATED'].includes(m.status));

  const getStatusClass = (status) => {
    switch (status) {
      case 'PAID': return 'status-paid';
      case 'FUNDED': return 'status-funded';
      case 'REJECTED': return 'status-rejected';
      case 'SUBMITTED': return 'status-submitted';
      default: return 'status-default';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* Header Area */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Freelancer Dashboard</h2>
            <p className="dashboard-header-text">Welcome back, {user?.email}</p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/freelancer/profile" className="btn-premium !bg-gradient-to-r !from-neutral-700 !to-neutral-900 !shadow-neutral-500/30">Profile</Link>
            <Link to="/freelancer/tasks" className="btn-premium !bg-gradient-to-r !from-neutral-700 !to-neutral-900 !shadow-neutral-500/30">All Tasks</Link>
            <Link to="/freelancer/milestones" className="btn-premium">Manage Milestones</Link>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-neutral-500">Loading dashboard data...</div>
        ) : (
          <div className="dashboard-grid dashboard-grid-sidebar">

            {/* Main Content Area */}
            <div className="dashboard-main-content dashboard-section">

              <section>
                <div className="alert-header">
                  <span className="alert-icon">⚡</span>
                  <h3 className="alert-title">Action Required</h3>
                </div>

                {actionableMilestones.length === 0 ? (
                  <div className="card empty-state">
                    <p>You have no pending milestones to submit.</p>
                  </div>
                ) : (
                  <div className="dashboard-list flex flex-col gap-4">
                    {actionableMilestones.map(m => (
                      <div key={m.id} className="card p-6 !border-red-200 !bg-red-50/40 transform transition hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="list-item-title text-xl text-red-900">{m.taskTitle}</h4>
                            <span className="text-neutral-600 font-medium text-sm">{m.title}</span>
                          </div>
                          <span className={`freelancer-status-badge ${getStatusClass(m.status)}`}>
                            {m.status}
                          </span>
                        </div>

                        {m.rejectionReason && (
                          <div className="freelancer-feedback-alert mt-4 shadow-sm">
                            <h4 className="flex items-center gap-2">
                              <span>🚩</span> Fix Required:
                            </h4>
                            <p>{m.rejectionReason}</p>
                          </div>
                        )}

                        <div className="mt-6">
                          <Link
                            to={`/freelancer/submit/${m.id}`}
                            className={`btn-premium w-full !block text-center shadow-lg ${m.status === 'REJECTED'
                                ? '!bg-gradient-to-r !from-red-600 !to-red-700 !shadow-red-500/40'
                                : '!bg-gradient-to-r !from-emerald-600 !to-emerald-700 !shadow-emerald-500/40'
                              }`}
                          >
                            {m.status === 'REJECTED' ? 'Review & Re-submit Work' : 'Submit Work Now'}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* Sidebar */}
            <div className="dashboard-section">
              <section>
                <div className="alert-header mb-4">
                  <span className="alert-icon opacity-80 filter-none">📋</span>
                  <h3 className="text-xl font-bold text-neutral-800">Ongoing Tasks</h3>
                </div>
                {tasks.length === 0 ? (
                  <div className="card empty-state">No tasks assigned yet.</div>
                ) : (
                  <div className="dashboard-list">
                    {tasks.map(task => (
                      <div key={task.id} className="card list-item-card flex flex-col">
                        <h4 className="list-item-title mb-3">{task.title}</h4>
                        <div className="list-item-footer mt-auto pt-2 border-t border-neutral-100">
                          <span className="freelancer-status-badge status-default">
                            {task.status}
                          </span>
                          <Link
                            to="/freelancer/milestones"
                            className="list-item-link !text-sm"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
