import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import '../Dashboard.css';
import './Client.css';

export const ClientMilestonesPage = () => {
  const { user }                = useContext(AuthContext);
  const [milestones, setMilestones]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [rejectionReasons, setRejectionReasons]   = useState({});

  useEffect(() => { fetchMilestones(); }, []);

  const fetchMilestones = async () => {
    try {
      const res = await api.get(`/client/milestones/${user.id}`);
      setMilestones(res.data);
    } catch {
      setError('Failed to fetch milestones');
    }
    setLoading(false);
  };

  const handleReasonChange = (id, reason) =>
    setRejectionReasons(prev => ({ ...prev, [id]: reason }));

  const handleFund = async (milestoneId) => {
    try {
      await api.post(`/client/fund-milestone/${milestoneId}`);
      fetchMilestones();
    } catch { setError('Failed to fund milestone'); }
  };

  const handleApprove = async (milestoneId) => {
    try {
      await api.post(`/client/approve-milestone/${milestoneId}`);
      setSelectedMilestone(null);
      fetchMilestones();
    } catch { setError('Failed to approve milestone'); }
  };

  const handleReject = async (milestoneId) => {
    const reason = rejectionReasons[milestoneId];
    if (!reason) { alert('Please enter a reason for rejection'); return; }
    try {
      await api.post(`/client/reject-milestone/${milestoneId}`, reason);
      handleReasonChange(milestoneId, '');
      setSelectedMilestone(null);
      fetchMilestones();
    } catch { setError('Failed to reject milestone'); }
  };

  const getStatusClass = (status) => ({
    PAID: 'status-paid', FUNDED: 'status-funded',
    SUBMITTED: 'status-submitted', REJECTED: 'status-rejected',
  })[status] || 'status-default';

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) setSelectedMilestone(null);
  };

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container"><div className="dash-loading">Loading milestones...</div></div>
    </div>
  );

  if (error) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="empty-state" style={{ color: 'var(--red)' }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>My Milestones</h2>
            <p className="dashboard-header-text">Review submitted work and manage milestone payments.</p>
          </div>
        </div>

        {milestones.length === 0 ? (
          <div className="empty-state">No milestones yet.</div>
        ) : (
          <div className="table-container">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Milestone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.taskTitle}</td>
                    <td style={{ color: 'var(--ink-2)' }}>{m.title}</td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-d)', fontWeight: 700,
                        fontSize: '14px', color: 'var(--accent-3)',
                      }}>
                        ${m.amount}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(m.status)}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {m.status === 'SUGGESTED' && (
                          <a
                            href={`/client/task/${m.taskId}/milestones`}
                            className="btn-secondary btn-sm"
                          >
                            Manage Task →
                          </a>
                        )}
                        {m.status === 'SUBMITTED' && (
                          <>
                            <button
                              className="btn-approve"
                              style={{ flex: 'none', padding: '6px 14px', fontSize: '12px' }}
                              onClick={() => handleApprove(m.id)}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="btn-reject"
                              style={{ flex: 'none', padding: '6px 14px', fontSize: '12px' }}
                              onClick={() => handleReject(m.id)}
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        <button
                          className="freelancer-action-btn"
                          onClick={() => setSelectedMilestone(m)}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── MODAL ── */}
        {selectedMilestone && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" style={{ maxWidth: '580px' }}>

              <div className="modal-header">
                <div>
                  <div className="modal-title">{selectedMilestone.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginTop: '3px' }}>
                    {selectedMilestone.taskTitle}
                  </div>
                </div>
                <button className="modal-close" onClick={() => setSelectedMilestone(null)}>✕</button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {selectedMilestone.description && (
                  <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.65 }}>
                    {selectedMilestone.description}
                  </p>
                )}

                {/* Amount + Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="freelancer-info-card" style={{ padding: '16px' }}>
                    <div className="freelancer-info-card-label">Amount</div>
                    <div className="freelancer-info-card-value" style={{ color: 'var(--accent-3)', marginTop: '4px' }}>
                      ${selectedMilestone.amount}
                    </div>
                  </div>
                  <div className="freelancer-info-card" style={{ padding: '16px' }}>
                    <div className="freelancer-info-card-label">Status</div>
                    <div style={{ marginTop: '8px' }}>
                      <span className={`status-badge ${getStatusClass(selectedMilestone.status)}`}>
                        {selectedMilestone.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submission */}
                {selectedMilestone.submissionUrl && (
                  <div style={{
                    padding: '14px 16px',
                    background: 'var(--paper)',
                    border: '2px solid var(--border-light)',
                    borderRadius: 'var(--r)',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-d)', fontSize: '11px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      color: 'var(--ink-3)', marginBottom: '6px',
                    }}>
                      Freelancer Submission
                    </div>
                    <a
                      href={selectedMilestone.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '13px', color: 'var(--accent-2)', fontWeight: 500,
                        textDecoration: 'underline', textUnderlineOffset: '3px',
                        wordBreak: 'break-all',
                      }}
                    >
                      {selectedMilestone.submissionUrl}
                    </a>
                  </div>
                )}

                {/* Review actions for SUBMITTED */}
                {selectedMilestone.status === 'SUBMITTED' && (
                  <div className="review-feedback-area" style={{ marginTop: 0 }}>
                    <div className="review-feedback-label">
                      Feedback (optional for approval, required to reject)
                    </div>
                    <textarea
                      className="dash-textarea"
                      rows={3}
                      placeholder="Explain what's good or what needs fixing…"
                      value={rejectionReasons[selectedMilestone.id] || ''}
                      onChange={(e) => handleReasonChange(selectedMilestone.id, e.target.value)}
                    />
                    <div className="review-actions">
                      <button className="btn-approve" onClick={() => handleApprove(selectedMilestone.id)}>
                        🚀 Approve & Pay ${selectedMilestone.amount}
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(selectedMilestone.id)}>
                        ✕ Reject Work
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};