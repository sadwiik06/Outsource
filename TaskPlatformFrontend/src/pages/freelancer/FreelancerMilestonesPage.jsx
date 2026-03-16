import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import '../Dashboard.css';
import './Freelancer.css';

export const FreelancerMilestonesPage = () => {
  const { milestoneId } = useParams();
  const { user }        = useContext(AuthContext);
  const navigate        = useNavigate();

  const [milestone, setMilestone]         = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState('');

  useEffect(() => {
    if (user?.id && milestoneId) fetchMilestone();
  }, [user, milestoneId]);

  const fetchMilestone = async () => {
    try {
      const res = await api.get(`/freelancer/milestones/${user.id}`);
      const m   = res.data.find(item => item.id.toString() === milestoneId);
      if (m) { setMilestone(m); setSubmissionUrl(m.submissionUrl || ''); }
      else setError('Milestone not found or not assigned to you.');
    } catch {
      setError('Failed to fetch milestone details.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionUrl) { alert('Please enter a submission URL'); return; }
    setSubmitting(true);
    try {
      await api.post(`/freelancer/submit-milestone/${milestoneId}`, { submissionUrl }, {
        headers: { 'X-User-Id': user.id },
      });
      navigate('/freelancer/dashboard');
    } catch {
      alert('Submission failed. Make sure this milestone is in a valid state (Suggested, Funded, or Rejected).');
    }
    setSubmitting(false);
  };

  const getStatusClass = (status) => ({
    PAID: 'status-paid', FUNDED: 'status-funded',
    REJECTED: 'status-rejected', SUBMITTED: 'status-submitted',
  })[status] || 'status-default';

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container"><div className="dash-loading">Loading milestone...</div></div>
    </div>
  );

  if (error || !milestone) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="freelancer-empty-state" style={{ color: 'var(--red)' }}>
          {error || 'No milestone found.'}
        </div>
      </div>
    </div>
  );

  const isRejected = milestone.status === 'REJECTED';

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container" style={{ maxWidth: '720px' }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary btn-sm"
          style={{ width: 'fit-content' }}
        >
          ← Back
        </button>

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Submit Work</h2>
            <p className="dashboard-header-text">
              {milestone.taskTitle} — {milestone.title}
            </p>
          </div>
          <span className={`freelancer-status-badge ${getStatusClass(milestone.status)}`}>
            {milestone.status}
          </span>
        </div>

        {/* Milestone detail card */}
        <div className="freelancer-details-card">

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div className="freelancer-info-card" style={{ padding: '16px' }}>
              <div className="freelancer-info-card-label">Task</div>
              <div style={{
                fontFamily: 'var(--font-d)', fontWeight: 700, fontSize: '15px',
                color: 'var(--ink)', marginTop: '4px',
              }}>
                {milestone.taskTitle}
              </div>
            </div>
            <div className="freelancer-info-card" style={{ padding: '16px' }}>
              <div className="freelancer-info-card-label">Payout on Approval</div>
              <div className="freelancer-info-card-value" style={{ color: 'var(--accent-3)', marginTop: '4px' }}>
                ${milestone.amount}
              </div>
            </div>
          </div>

          {/* Rejection feedback */}
          {milestone.rejectionReason && (
            <div className="freelancer-feedback-alert" style={{ marginBottom: '20px' }}>
              <h4>🚩 Feedback to Address</h4>
              <p>{milestone.rejectionReason}</p>
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop: '2px dashed var(--border-light)', marginBottom: '20px' }} />

          {/* Submit form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="dash-field" style={{ marginBottom: 0 }}>
              <label className="dash-label">Submission URL</label>
              <input
                type="url"
                placeholder="https://github.com/your-repo or figma.com/…"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                className="dash-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-lg btn-full"
              style={{
                background: isRejected ? 'var(--red)' : 'var(--ink)',
                opacity: submitting ? 0.65 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
                marginTop: '4px',
              }}
            >
              {submitting
                ? 'Submitting…'
                : isRejected
                  ? '→ Resubmit Updated Work'
                  : '→ Confirm & Submit Work'}
            </button>

            <p style={{
              textAlign: 'center', fontSize: '12px', color: 'var(--ink-4)',
              fontFamily: 'var(--font-d)', letterSpacing: '0.3px',
            }}>
              The client will be notified immediately upon submission.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

