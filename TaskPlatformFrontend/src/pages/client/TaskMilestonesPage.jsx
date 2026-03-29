import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { clientTaskService } from '../../services/taskService';
import { taskService } from '../../services/taskService';
import '../Dashboard.css';
import './Client.css';

export const TaskMilestonesPage = () => {
  const { taskId }    = useParams();
  const navigate      = useNavigate();
  const { user, refreshUser } = useContext(AuthContext);

  const [task, setTask]                           = useState(null);
  const [milestones, setMilestones]               = useState([]);
  const [selectedMilestones, setSelectedMilestones] = useState([]);
  const [rejectionReasons, setRejectionReasons]   = useState({});
  const [loading, setLoading]                     = useState(true);

  useEffect(() => { if (taskId) loadAll(); }, [taskId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [taskRes, milestoneRes] = await Promise.all([
        taskService.getTaskById(taskId),
        clientTaskService.getMilestonesByTaskId(taskId),
      ]);
      setTask(taskRes.data);
      setMilestones(milestoneRes.data);
      const suggestedIds = milestoneRes.data.filter(m => m.status === 'SUGGESTED').map(m => m.id);
      setSelectedMilestones(suggestedIds);
      const reasons = {};
      milestoneRes.data.forEach(m => reasons[m.id] = '');
      setRejectionReasons(reasons);
      refreshUser();
    } catch (err) {
      console.error('Failed to load task/milestones', err);
    }
    setLoading(false);
  };

  const handleReasonChange = (id, reason) =>
    setRejectionReasons(prev => ({ ...prev, [id]: reason }));

  const toggleMilestone = (id, checked) => {
    setSelectedMilestones(prev =>
      checked ? [...prev, id] : prev.filter(x => x !== id)
    );
  };

  const handleSuggest = () => {
    clientTaskService.getSuggestedMilestones(taskId)
      .then(r => {
        setMilestones(r.data);
        setSelectedMilestones(r.data.map(m => m.id));
      })
      .catch(err => alert('Error: ' + err.message));
  };

  const handleConfirm = () => {
    if (selectedMilestones.length === 0) { alert('Select at least one milestone'); return; }
    clientTaskService.confirmMilestones(taskId, selectedMilestones)
      .then(() => { alert('Milestones confirmed and funded!'); loadAll(); })
      .catch(err => alert('Error: ' + err.message));
  };

  const handleFund = (milestoneId) => {
    clientTaskService.fundMilestone(milestoneId)
      .then(() => { alert('Milestone funded!'); loadAll(); })
      .catch(err => alert('Error: ' + err.message));
  };

  const handleApprove = (milestoneId) => {
    const message = rejectionReasons[milestoneId];
    clientTaskService.approveMilestone(milestoneId, { message })
      .then(() => { alert('Approved and payment released!'); loadAll(); })
      .catch(err => alert('Error: ' + (err.response?.data || err.message)));
  };

  const handleReject = (milestoneId) => {
    const reason = rejectionReasons[milestoneId];
    if (!reason) { alert('Please enter feedback for rejection'); return; }
    clientTaskService.rejectMilestone(milestoneId, { reason })
      .then(() => { alert('Milestone rejected'); loadAll(); })
      .catch(err => alert('Error: ' + (err.response?.data || err.message)));
  };

  const getStatusClass = (status) => ({
    PAID: 'status-paid', FUNDED: 'status-funded',
    REJECTED: 'status-rejected', SUBMITTED: 'status-submitted',
    SUGGESTED: 'status-pending',
  })[status] || 'status-default';

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container"><div className="dash-loading">Loading milestones...</div></div>
    </div>
  );

  const hasSuggested = milestones.some(m => m.status === 'SUGGESTED');

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* Back */}
        <button className="btn-secondary btn-sm" style={{ width: 'fit-content' }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Manage Milestones</h2>
            <p className="dashboard-header-text">
              {task?.title}
              {task?.totalBudget && (
                <span style={{
                  marginLeft: '12px',
                  fontFamily: 'var(--font-d)', fontWeight: 700,
                  fontSize: '13px', color: 'var(--accent-3)',
                  background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                  borderRadius: '100px', padding: '2px 10px',
                  boxShadow: '2px 2px 0 #bbf7d0',
                }}>
                  Budget: ${task.totalBudget}
                </span>
              )}
            </p>
          </div>
          <div className="dashboard-header-actions">
            {milestones.length === 0 && (
              <button className="btn-accent" onClick={handleSuggest}>
                ✦ AI Suggest Milestones
              </button>
            )}
            {hasSuggested && (
              <button className="btn-primary" onClick={handleConfirm}>
                ✓ Confirm & Fund Selected
              </button>
            )}
          </div>
        </div>

        {/* Milestone list */}
        {milestones.length === 0 ? (
          <div className="empty-state">
            No milestones yet — use AI Suggest to generate them automatically.
          </div>
        ) : (
          <div className="dashboard-list">
            {milestones.map(m => (
              <div
                key={m.id}
                className="review-card"
                style={{
                  borderLeftColor: m.status === 'SUGGESTED' ? 'var(--accent-2)'
                    : m.status === 'SUBMITTED' ? '#f59e0b'
                    : m.status === 'PAID'    ? 'var(--accent-3)'
                    : m.status === 'REJECTED' ? 'var(--red)'
                    : 'var(--border-light)',
                }}
              >
                {/* Top row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: '16px', marginBottom: '12px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="review-card-title">{m.title}</div>
                    {m.description && (
                      <p style={{ fontSize: '13px', color: 'var(--ink-3)', marginTop: '4px', lineHeight: 1.6 }}>
                        {m.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '14px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'var(--font-d)', fontWeight: 700,
                        fontSize: '13px', color: 'var(--accent-3)',
                      }}>
                        ${m.amount}
                      </span>
                      <span className={`status-badge ${getStatusClass(m.status)}`}>{m.status}</span>
                    </div>

                    {m.submissionUrl && (
                      <div style={{ marginTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 600 }}>
                          Submission:{' '}
                        </span>
                        <a
                          href={m.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '12px', color: 'var(--accent-2)',
                            textDecoration: 'underline', textUnderlineOffset: '3px',
                            wordBreak: 'break-all',
                          }}
                        >
                          {m.submissionUrl}
                        </a>
                      </div>
                    )}

                    {m.rejectionReason && (
                      <div className="freelancer-feedback-alert" style={{ marginTop: '10px' }}>
                        <h4>🚩 Rejection Reason</h4>
                        <p>{m.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Checkbox for SUGGESTED */}
                  {m.status === 'SUGGESTED' && (
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '6px', flexShrink: 0,
                    }}>
                      <div style={{
                        width: '22px', height: '22px',
                        border: '2px solid var(--border)',
                        borderRadius: '5px',
                        background: selectedMilestones.includes(m.id) ? 'var(--ink)' : 'var(--white)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background var(--trans)',
                        boxShadow: '2px 2px 0 var(--border)',
                      }}
                        onClick={() => toggleMilestone(m.id, !selectedMilestones.includes(m.id))}
                      >
                        {selectedMilestones.includes(m.id) && (
                          <span style={{ color: 'var(--white)', fontSize: '12px', fontWeight: 800 }}>✓</span>
                        )}
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--ink-4)', fontFamily: 'var(--font-d)', fontWeight: 700 }}>
                        {selectedMilestones.includes(m.id) ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Review area for SUBMITTED */}
                {m.status === 'SUBMITTED' && (
                  <div className="review-feedback-area">
                    <div className="review-feedback-label">
                      Feedback (optional for approval, required to reject)
                    </div>
                    <textarea
                      className="dash-textarea"
                      rows={3}
                      placeholder="Explain what's good or what needs fixing…"
                      value={rejectionReasons[m.id] || ''}
                      onChange={(e) => handleReasonChange(m.id, e.target.value)}
                    />
                    <div className="review-actions">
                      <button className="btn-approve" onClick={() => handleApprove(m.id)}>
                        🚀 Approve & Pay ${m.amount}
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(m.id)}>
                        ✕ Reject Work
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Floating confirm bar at bottom */}
        {hasSuggested && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'var(--ink)',
            border: '2px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow-brut-lg)',
          }}>
            <span style={{
              fontFamily: 'var(--font-d)', fontSize: '13px', fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
            }}>
              {selectedMilestones.length} milestone{selectedMilestones.length !== 1 ? 's' : ''} selected
            </span>
            <button className="btn-approve" style={{ flex: 'none' }} onClick={handleConfirm}>
              ✓ Confirm & Fund Selected
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

