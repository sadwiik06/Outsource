import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { clientTaskService } from '../../services/taskService';
import { Link } from 'react-router-dom';
import '../Dashboard.css';
import './Client.css';

export const ClientDashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [tasks, setTasks]             = useState([]);
  const [milestones, setMilestones]   = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [selectedTask, setSelectedTask]         = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  const fetchData = () => {
    clientTaskService.getTasksByClientId(user.id).then(r => setTasks(r.data));
    clientTaskService.getFreelancersWithPerformance().then(r => setFreelancers(r.data));
    clientTaskService.getClientMilestones(user.id).then(r => setMilestones(r.data));
    refreshUser();
  };

  const handleReasonChange = (id, reason) =>
    setRejectionReasons(prev => ({ ...prev, [id]: reason }));

  const handleApprove = (milestoneId) => {
    const message = rejectionReasons[milestoneId];
    clientTaskService.approveMilestone(milestoneId, { message })
      .then(() => {
        alert('Milestone approved and payment released!');
        handleReasonChange(milestoneId, '');
        fetchData();
      })
      .catch(err => alert('Error approving: ' + (err.response?.data || err.message)));
  };

  const handleReject = (milestoneId) => {
    const reason = rejectionReasons[milestoneId];
    if (!reason) { alert('Please enter a feedback reason for rejection.'); return; }
    clientTaskService.rejectMilestone(milestoneId, { reason })
      .then(() => {
        alert('Milestone rejected with feedback.');
        handleReasonChange(milestoneId, '');
        fetchData();
      })
      .catch(err => alert('Error rejecting: ' + (err.response?.data || err.message)));
  };

  const handleAssign = (freelancerId) => {
    if (!selectedTask) return;
    clientTaskService.assignFreelancer(selectedTask.id, freelancerId).then(() => {
      alert('Freelancer assigned successfully!');
      setSelectedTask(null);
      fetchData();
    });
  };

  const submittedMilestones = milestones.filter(m => m.status === 'SUBMITTED');
  const openTasks           = tasks.filter(t => t.status === 'OPEN');
  const ongoingTasks        = tasks.filter(t => t.status === 'IN_PROGRESS');

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* ── HEADER ── */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Client Dashboard</h2>
            <p className="dashboard-header-text">Welcome back, {user?.email}</p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/client/create-task" className="btn-secondary">+ Create Task</Link>
            <Link to="/client/tasks"       className="btn-secondary">My Tasks</Link>
            <Link to="/client/milestones"  className="btn-primary">All Milestones →</Link>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-title">Total Tasks</div>
            <div className="stat-card-value">{tasks.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">In Progress</div>
            <div className="stat-card-value">{ongoingTasks.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">Awaiting Review</div>
            <div className="stat-card-value" style={{ color: '#b45309' }}>
              {submittedMilestones.length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">Open Tasks</div>
            <div className="stat-card-value">{openTasks.length}</div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="dashboard-grid dashboard-grid-sidebar">

          {/* LEFT: Main content */}
          <div className="dashboard-main-content dashboard-section">

            {/* ── Milestones Needing Review ── */}
            <section>
              <div className="alert-header">
                <span className="alert-icon">⚠️</span>
                <h3 className="alert-title">Milestones Needing Review</h3>
              </div>

              {submittedMilestones.length === 0 ? (
                <div className="empty-state">
                  ✓ No milestones awaiting your review at the moment.
                </div>
              ) : (
                <div className="dashboard-list">
                  {submittedMilestones.map(m => (
                    <div key={m.id} className="review-card">
                      <div className="review-card-head">
                        <div>
                          <div className="review-card-title">{m.taskTitle} — {m.title}</div>
                          <div className="review-card-url">
                            <strong>Submitted work: </strong>
                            <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer">
                              {m.submissionUrl}
                            </a>
                          </div>
                        </div>
                        <span className="badge-review">Awaiting Review</span>
                      </div>

                      <div className="review-feedback-area">
                        <div className="review-feedback-label">
                          Feedback (optional for approval, required to reject)
                        </div>
                        <textarea
                          className="dash-textarea"
                          rows={3}
                          placeholder="Tell the freelancer what's good or what needs fixing…"
                          value={rejectionReasons[m.id] || ''}
                          onChange={(e) => handleReasonChange(m.id, e.target.value)}
                        />
                        <div className="review-actions">
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(m.id)}
                          >
                            🚀 Approve & Pay ${m.amount}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReject(m.id)}
                          >
                            ✕ Reject Work
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Open Tasks ── */}
            <section>
              <div className="section-title">Open Tasks — Awaiting Assignment</div>

              {openTasks.length === 0 ? (
                <div className="empty-state">No open tasks seeking freelancers.</div>
              ) : (
                <div className="dashboard-list">
                  {openTasks.map(task => (
                    <div key={task.id} className="open-task-card">
                      <div className="open-task-card-title">{task.title}</div>
                      <div className="open-task-card-desc">{task.description}</div>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => setSelectedTask(task)}
                      >
                        Assign Freelancer →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* RIGHT: Sidebar */}
          <div className="dashboard-section">

            {/* ── Ongoing Tasks ── */}
            <section>
              <div className="section-title">Ongoing Tasks</div>

              {ongoingTasks.length === 0 ? (
                <div className="empty-state">No active ongoing tasks.</div>
              ) : (
                <div className="dashboard-list">
                  {ongoingTasks.map(task => (
                    <div key={task.id} className="ongoing-task-card">
                      <div className="ongoing-task-title">{task.title}</div>
                      <div className="list-item-footer">
                        <span className="list-item-badge">{task.status}</span>
                        <Link
                          to={`/client/task/${task.id}/milestones`}
                          className="list-item-link"
                        >
                          Milestones →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Assign Freelancer Panel ── */}
            {selectedTask && (
              <section>
                <div className="assign-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div className="assign-panel-title">Assign Freelancer</div>
                      <div className="assign-panel-sub">For "{selectedTask.title}"</div>
                    </div>
                    <button
                      onClick={() => setSelectedTask(null)}
                      style={{
                        width: '26px', height: '26px',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background var(--trans)',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="assign-panel-list">
                    {freelancers.length === 0 ? (
                      <div className="assign-empty">No freelancers available.</div>
                    ) : (
                      freelancers.map(fl => (
                        <div key={fl.id} className="assign-freelancer-row">
                          <div className="assign-freelancer-info">
                            <div className="assign-freelancer-email">
                              <Link to={`/freelancer-profile/${fl.id}`} target="_blank" style={{ color: 'var(--accent-2)', textDecoration: 'underline' }}>
                                {fl.email}
                              </Link>
                            </div>
                            <div className="assign-freelancer-level">
                              Level: {fl.performance?.performanceLevel || 'N/A'}
                            </div>
                          </div>
                          <button
                            className="btn-assign"
                            onClick={() => handleAssign(fl.id)}
                          >
                            Assign
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};