import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import './Freelancer.css';

export const FreelancerMilestonesPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [submissionUrls, setSubmissionUrls] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id) {
      fetchMilestones();
    }
  }, [user]);

  const fetchMilestones = async () => {
    try {
      const response = await api.get(`/freelancer/milestones/${user.id}`);
      setMilestones(response.data);
      // Initialize submission URLs from current data if needed
      const urls = {};
      response.data.forEach(m => {
        urls[m.id] = m.submissionUrl || '';
      });
      setSubmissionUrls(urls);
    } catch (err) {
      setError('Failed to fetch milestones');
    }
    setLoading(false);
  };

  const handleUrlChange = (id, url) => {
    setSubmissionUrls(prev => ({ ...prev, [id]: url }));
  };

  const handleSubmit = async (milestoneId) => {
    const url = submissionUrls[milestoneId];
    if (!url) {
      alert('Please enter a submission URL');
      return;
    }
    try {
      await api.post(`/freelancer/submit-milestone/${milestoneId}`, { submissionUrl: url }, {
        headers: { 'X-User-Id': user.id },
      });
      alert('Milestone submitted successfully!');
      setSelectedMilestone(null);
      fetchMilestones();
    } catch (err) {
      setError('Failed to submit milestone');
    }
  };

  if (loading) return <div className="freelancer-container"><div className="freelancer-empty-state">Loading milestones...</div></div>;
  if (error) return <div className="freelancer-container"><div className="freelancer-empty-state text-red-600">{error}</div></div>;

  const getStatusClass = (status) => {
    switch (status) {
      case 'PAID': return 'status-paid';
      case 'FUNDED': return 'status-funded';
      case 'REJECTED': return 'status-rejected';
      case 'SUBMITTED': return 'status-submitted';
      default: return 'status-default';
    }
  };

  const openModal = (milestone) => setSelectedMilestone(milestone);
  const closeModal = () => setSelectedMilestone(null);

  // Close modal on overlay click
  const handleOverlayClick = (e) => {
    if (e.target.className.includes('freelancer-modal-overlay')) {
      closeModal();
    }
  };

  return (
    <div className="freelancer-container">
      <div className="freelancer-header">
        <h2>My Milestones</h2>
        <p>Track your progress, submit work, and get paid.</p>
      </div>

      {milestones.length === 0 ? (
        <div className="freelancer-empty-state">No milestones assigned.</div>
      ) : (
        <div className="freelancer-table-container">
          <table className="freelancer-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions / Submission</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map(milestone => (
                <tr key={milestone.id}>
                  <td className="font-medium">{milestone.taskTitle}</td>
                  <td className="font-bold text-neutral-900">${milestone.amount}</td>
                  <td>
                    <span className={`freelancer-status-badge ${getStatusClass(milestone.status)}`}>
                      {milestone.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-4">
                      {milestone.status === 'SUBMITTED' && (
                        <span className="text-neutral-500 text-sm whitespace-nowrap border border-neutral-200 bg-neutral-50 px-3 py-1 rounded-full font-medium">Awaiting review...</span>
                      )}

                      {milestone.status === 'PAID' && (
                        <span className="text-emerald-700 font-bold whitespace-nowrap bg-emerald-50 px-3 py-1 rounded-full text-sm">✓ Paid in full</span>
                      )}

                      <button
                        onClick={() => openModal(milestone)}
                        className="btn-premium text-xs py-1.5 px-4 whitespace-nowrap shadow-sm"
                      >
                        {['SUGGESTED', 'FUNDED', 'REJECTED', 'CREATED'].includes(milestone.status) ? 'Submit / Details' : 'View Details'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedMilestone && (
        <div className="freelancer-modal-overlay" onClick={handleOverlayClick}>
          <div className="freelancer-modal-content freelancer-details-card !mt-0 !mb-0">
            <div className="freelancer-details-header">
              <div>
                <h3 className="!text-2xl mb-1">{selectedMilestone.taskTitle}</h3>
                <span className="text-neutral-500 font-medium">{selectedMilestone.title}</span>
              </div>
              <button
                className="btn-secondary text-sm !px-3 hover:bg-neutral-100"
                onClick={closeModal}
              >
                ✕ Close
              </button>
            </div>

            <div className="freelancer-details-content">
              <p className="text-lg text-neutral-700 mb-4">{selectedMilestone.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="freelancer-info-card !p-4">
                  <div className="freelancer-info-card-label">Milestone Value</div>
                  <div className="text-2xl font-bold text-emerald-700">${selectedMilestone.amount}</div>
                </div>
                <div className="freelancer-info-card !p-4">
                  <div className="freelancer-info-card-label">Current Status</div>
                  <div className={`mt-2 freelancer-status-badge ${getStatusClass(selectedMilestone.status)}`}>
                    {selectedMilestone.status}
                  </div>
                </div>
              </div>

              {selectedMilestone.rejectionReason && (
                <div className="freelancer-feedback-alert">
                  <h4>🚩 Rejection Feedback</h4>
                  <p>{selectedMilestone.rejectionReason}</p>
                </div>
              )}

              {selectedMilestone.approvalMessage && (
                <div className="freelancer-success-alert">
                  <h4>✨ Client Praise & Approval</h4>
                  <p>{selectedMilestone.approvalMessage}</p>
                </div>
              )}

              {['SUGGESTED', 'FUNDED', 'REJECTED', 'CREATED'].includes(selectedMilestone.status) && (
                <div className="freelancer-submit-form mt-8">
                  <h4 className="text-neutral-900 font-bold text-lg mb-4">Submit Your Work</h4>
                  <div className="freelancer-input-group !flex-col !items-stretch">
                    <input
                      type="url"
                      placeholder="Paste Deliverable URL (GitHub, Figma, Drive, etc.)"
                      value={submissionUrls[selectedMilestone.id] || ''}
                      onChange={(e) => handleUrlChange(selectedMilestone.id, e.target.value)}
                      className="freelancer-input !text-lg !py-3"
                    />
                    <button
                      onClick={() => handleSubmit(selectedMilestone.id)}
                      className="btn-premium !py-3 !text-lg !w-full mt-2"
                    >
                      {selectedMilestone.status === 'REJECTED' ? 'Resubmit Updated Work' : 'Confirm & Submit Work'}
                    </button>
                  </div>
                </div>
              )}

              {selectedMilestone.submissionUrl && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <p className="text-neutral-700">
                    <strong className="text-neutral-900">Last Submission:</strong>{' '}
                    <a
                      href={selectedMilestone.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline break-all"
                    >
                      {selectedMilestone.submissionUrl}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
