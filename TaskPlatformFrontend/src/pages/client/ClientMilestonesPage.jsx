import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

export const ClientMilestonesPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const response = await api.get(`/client/milestones/${user.id}`);
      setMilestones(response.data);
    } catch (err) {
      setError('Failed to fetch milestones');
    }
    setLoading(false);
  };

  const [rejectionReasons, setRejectionReasons] = useState({});

  const handleReasonChange = (id, reason) => {
    setRejectionReasons(prev => ({ ...prev, [id]: reason }));
  };

  const handleFund = async (milestoneId) => {
    try {
      await api.post(`/client/fund-milestone/${milestoneId}`);
      fetchMilestones();
    } catch (err) {
      setError('Failed to fund milestone');
    }
  };

  const handleApprove = async (milestoneId) => {
    try {
      await api.post(`/client/approve-milestone/${milestoneId}`);
      setSelectedMilestone(null);
      fetchMilestones();
    } catch (err) {
      setError('Failed to approve milestone');
    }
  };

  const handleReject = async (milestoneId) => {
    const reason = rejectionReasons[milestoneId];
    if (!reason) {
      alert('Please enter a reason or feedback for rejection');
      return;
    }
    try {
      await api.post(`/client/reject-milestone/${milestoneId}`, reason);
      handleReasonChange(milestoneId, ''); // Clear reason
      setSelectedMilestone(null);
      fetchMilestones();
    } catch (err) {
      setError('Failed to reject milestone');
    }
  };

  if (loading) return <p>Loading milestones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Milestones</h2>
      {milestones.length === 0 ? (
        <p>No milestones yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map(milestone => (
              <tr key={milestone.id}>
                <td>{milestone.taskTitle}</td>
                <td>${milestone.amount}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: milestone.status === 'PAID' ? '#c8e6c9' :
                      milestone.status === 'FUNDED' ? '#b3e5fc' :
                        milestone.status === 'SUBMITTED' ? '#fff9c4' : '#eee'
                  }}>
                    {milestone.status}
                  </span>
                </td>
                <td>
                  {milestone.status === 'SUGGESTED' && (
                    <button onClick={() => window.location.href = `/client/task/${milestone.taskId}/milestones`} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Manage Task</button>
                  )}
                  {milestone.status === 'SUBMITTED' && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleApprove(milestone.id)}
                        style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Approve & Pay
                      </button>
                      <button
                        onClick={() => handleReject(milestone.id)}
                        style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  <button onClick={() => setSelectedMilestone(milestone)} style={{ marginLeft: '10px' }}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedMilestone && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Milestone Details</h3>
          <p><strong>Title:</strong> {selectedMilestone.title}</p>
          <p><strong>Description:</strong> {selectedMilestone.description}</p>
          <p><strong>Amount:</strong> ${selectedMilestone.amount}</p>
          <p><strong>Status:</strong> {selectedMilestone.status}</p>

          {selectedMilestone.submissionUrl && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <h4>Freelancer Submission</h4>
              <p><strong>URL:</strong> <a href={selectedMilestone.submissionUrl} target="_blank" rel="noopener noreferrer">{selectedMilestone.submissionUrl}</a></p>

              {selectedMilestone.status === 'SUBMITTED' && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => handleApprove(selectedMilestone.id)}
                    style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                  >
                    Approve & Pay Freelancer
                  </button>
                  <button
                    onClick={() => handleReject(selectedMilestone.id)}
                    style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Request Revisions
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setSelectedMilestone(null)}
            style={{ marginTop: '15px', padding: '8px 16px' }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
