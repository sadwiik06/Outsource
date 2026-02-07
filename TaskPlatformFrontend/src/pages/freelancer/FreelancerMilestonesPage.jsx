import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

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

  if (loading) return <p>Loading milestones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Milestones</h2>
      {milestones.length === 0 ? (
        <p>No milestones assigned.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px' }}>Task</th>
              <th style={{ padding: '10px' }}>Amount</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Actions / Submission</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map(milestone => (
              <tr key={milestone.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{milestone.taskTitle}</td>
                <td style={{ padding: '10px' }}>${milestone.amount}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor:
                      milestone.status === 'PAID' ? '#c8e6c9' :
                        milestone.status === 'FUNDED' ? '#b3e5fc' :
                          milestone.status === 'REJECTED' ? '#ffcdd2' :
                            milestone.status === 'SUBMITTED' ? '#fff9c4' : '#eee',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>{milestone.status}</span>
                </td>
                <td style={{ padding: '10px' }}>
                  {['SUGGESTED', 'FUNDED', 'REJECTED', 'CREATED'].includes(milestone.status) && (
                    <a
                      href={`/freelancer/submit/${milestone.id}`}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}
                    >
                      {milestone.status === 'REJECTED' ? 'Resubmit' : 'Submit Work'}
                    </a>
                  )}
                  {milestone.status === 'SUBMITTED' && (
                    <span style={{ color: '#666', fontSize: '13px' }}>Awaiting client review...</span>
                  )}
                  {milestone.status === 'PAID' && (
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ Milestones Paid</span>
                  )}
                  <button
                    onClick={() => setSelectedMilestone(milestone)}
                    style={{ marginLeft: '10px', fontSize: '12px', background: 'none', border: 'none', color: '#2196F3', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedMilestone && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Milestone: {selectedMilestone.title}</h3>
            <button onClick={() => setSelectedMilestone(null)} style={{ padding: '5px 10px' }}>Close</button>
          </div>
          <p><strong>Description:</strong> {selectedMilestone.description}</p>
          <p><strong>Amount:</strong> ${selectedMilestone.amount}</p>
          <p><strong>Status:</strong> {selectedMilestone.status}</p>

          {selectedMilestone.rejectionReason && (
            <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f44336', marginTop: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#d32f2f' }}>Rejection Feedback</h4>
              <p style={{ margin: 0 }}>{selectedMilestone.rejectionReason}</p>
            </div>
          )}

          {selectedMilestone.approvalMessage && (
            <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4CAF50', marginTop: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#2e7d32' }}>Client Praise/Message</h4>
              <p style={{ margin: 0 }}>{selectedMilestone.approvalMessage}</p>
            </div>
          )}

          {['SUGGESTED', 'FUNDED', 'REJECTED', 'CREATED'].includes(selectedMilestone.status) && (
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: 'white' }}>
              <h4>Submit Your Work</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Paste Work URL (GitHub, Figma, etc.)"
                  value={submissionUrls[selectedMilestone.id] || ''}
                  onChange={(e) => handleUrlChange(selectedMilestone.id, e.target.value)}
                  style={{ flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button
                  onClick={() => handleSubmit(selectedMilestone.id)}
                  style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {selectedMilestone.status === 'REJECTED' ? 'Resubmit' : 'Submit Work'}
                </button>
              </div>
            </div>
          )}

          {selectedMilestone.submissionUrl && (
            <p style={{ marginTop: '15px' }}><strong>Last Submission:</strong> <a href={selectedMilestone.submissionUrl} target="_blank" rel="noopener noreferrer">{selectedMilestone.submissionUrl}</a></p>
          )}
        </div>
      )}
    </div>
  );
};
