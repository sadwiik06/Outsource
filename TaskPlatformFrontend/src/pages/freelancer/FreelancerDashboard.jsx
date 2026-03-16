import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import '../Dashboard.css';
import './Freelancer.css';

export const FreelancerDashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [stats, setStats]     = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchAll();
  }, [user?.id]);

  const fetchAll = async () => {
    try {
      const [statsRes, tasksRes, milestoneRes] = await Promise.all([
        api.get(`/freelancer/stats/${user.id}`),
        api.get(`/freelancer/tasks/${user.id}`),
        api.get(`/freelancer/milestones/${user.id}`),
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data);
      setMilestones(milestoneRes.data);
      refreshUser();
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    }
    setLoading(false);
  };

  const actionableMilestones = milestones.filter(m =>
    ['SUGGESTED', 'FUNDED', 'REJECTED', 'CREATED'].includes(m.status)
  );

  const getStatusClass = (status) => {
    const map = {
      PAID:      'status-paid',
      FUNDED:    'status-funded',
      REJECTED:  'status-rejected',
      SUBMITTED: 'status-submitted',
    };
    return map[status] || 'status-default';
  };

  const getCardModifier = (status) => {
    if (status === 'REJECTED')  return 'action-card--rejected';
    if (status === 'SUGGESTED') return 'action-card--suggested';
    if (status === 'FUNDED')    return 'action-card--funded';
    return '';
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* ── HEADER ── */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Freelancer Dashboard</h2>
            <p className="dashboard-header-text">Welcome back, {user?.email}</p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/freelancer/profile"    className="btn-secondary">Profile</Link>
            <Link to="/freelancer/tasks"      className="btn-secondary">All Tasks</Link>
            <Link to="/freelancer/milestones" className="btn-primary">Manage Milestones →</Link>
          </div>
        </div>

        {/* ── STATS ── */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-title">Tasks Assigned</div>
              <div className="stat-card-value">{stats.totalTasksAssigned ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Milestones Done</div>
              <div className="stat-card-value">{stats.completedMilestones ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Total Earned</div>
              <div className="stat-card-value">${stats.totalEarned ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Pending Payouts</div>
              <div className="stat-card-value">{stats.pendingMilestones ?? 0}</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="dash-loading">Loading dashboard data...</div>
        ) : (
          <div className="dashboard-grid dashboard-grid-sidebar">

            {/* ── MAIN: ACTION REQUIRED ── */}
            <div className="dashboard-main-content dashboard-section">
              <section>
                <div className="alert-header">
                  <span className="alert-icon">⚡</span>
                  <h3 className="alert-title">Action Required</h3>
                </div>

                {actionableMilestones.length === 0 ? (
                  <div className="empty-state">
                    ✓ No pending milestones — you're all caught up.
                  </div>
                ) : (
                  <div className="dashboard-list">
                    {actionableMilestones.map(m => (
                      <div
                        key={m.id}
                        className={`action-card ${getCardModifier(m.status)}`}
                      >
                        <div className="action-card-head">
                          <div>
                            <div className="action-card-task">{m.taskTitle}</div>
                            <div className="action-card-milestone">{m.title}</div>
                          </div>
                          <span className={`freelancer-status-badge ${getStatusClass(m.status)}`}>
                            {m.status}
                          </span>
                        </div>

                        {m.rejectionReason && (
                          <div className="freelancer-feedback-alert">
                            <h4>🚩 Fix Required</h4>
                            <p>{m.rejectionReason}</p>
                          </div>
                        )}

                        <Link
                          to={`/freelancer/submit/${m.id}`}
                          className={`action-card-submit-btn ${m.status === 'REJECTED' ? 'action-card-submit-btn--resubmit' : ''}`}
                        >
                          {m.status === 'REJECTED' ? '→ Review & Re-submit Work' : '→ Submit Work Now'}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* ── SIDEBAR: ONGOING TASKS ── */}
            <div className="dashboard-section">
              <section>
                <div className="freelancer-section-header">
                  <span className="freelancer-section-icon">📋</span>
                  <h3 className="freelancer-section-title">Ongoing Tasks</h3>
                </div>

                {tasks.length === 0 ? (
                  <div className="empty-state">No tasks assigned yet.</div>
                ) : (
                  <div className="dashboard-list">
                    {tasks.map(task => (
                      <div key={task.id} className="task-sidebar-card">
                        <div className="task-sidebar-name">{task.title}</div>
                        <div className="list-item-footer">
                          <span className={`freelancer-status-badge ${getStatusClass(task.status)}`}>
                            {task.status}
                          </span>
                          <Link to="/freelancer/milestones" className="list-item-link">
                            Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Balance callout */}
              {user?.balance !== undefined && (
                <div className="freelancer-info-card">
                  <div className="freelancer-info-card-label">Wallet Balance</div>
                  <div className="freelancer-info-card-value">${user.balance}</div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};