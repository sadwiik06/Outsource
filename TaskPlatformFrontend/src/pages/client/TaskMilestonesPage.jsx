import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { clientTaskService } from '../../services/taskService';
import { taskService } from '../../services/taskService';

export const TaskMilestonesPage = () => {
  const { taskId } = useParams();
  const { user, refreshUser } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestones, setSelectedMilestones] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    if (taskId) {
      loadTaskAndMilestones();
    }
  }, [taskId]);

  const loadTaskAndMilestones = async () => {
    try {
      const taskRes = await taskService.getTaskById(taskId);
      setTask(taskRes.data);
      const milestoneRes = await clientTaskService.getMilestonesByTaskId(taskId);
      setMilestones(milestoneRes.data);
      // Automatically select suggested milestones
      const suggestedIds = milestoneRes.data
        .filter(m => m.status === 'SUGGESTED')
        .map(m => m.id);
      setSelectedMilestones(suggestedIds);

      const reasons = {};
      milestoneRes.data.forEach(m => reasons[m.id] = '');
      setRejectionReasons(reasons);
      refreshUser();
    } catch (err) {
      console.error("Failed to load task/milestones", err);
    }
  };

  const handleReasonChange = (id, reason) => {
    setRejectionReasons(prev => ({ ...prev, [id]: reason }));
  };

  const handleSuggestMilestones = () => {
    clientTaskService.getSuggestedMilestones(taskId).then(response => {
      setMilestones(response.data);
      const suggestedIds = response.data.map(m => m.id);
      setSelectedMilestones(suggestedIds);
    }).catch(err => alert("Error suggesting milestones: " + err.message));
  };

  const handleConfirmMilestones = () => {
    if (selectedMilestones.length === 0) {
      alert("Please select milestones to confirm");
      return;
    }
    clientTaskService.confirmMilestones(taskId, selectedMilestones).then(() => {
      alert('Milestones confirmed and funded!');
      loadTaskAndMilestones();
    }).catch(err => alert("Error confirming milestones: " + err.message));
  };

  const handleFundMilestone = (milestoneId) => {
    clientTaskService.fundMilestone(milestoneId).then(() => {
      alert('Milestone funded!');
      loadTaskAndMilestones();
    }).catch(err => alert("Error funding milestone: " + err.message));
  };

  const handleApproveMilestone = (milestoneId) => {
    const message = rejectionReasons[milestoneId];
    clientTaskService.approveMilestone(milestoneId, { message }).then(() => {
      alert('Milestone approved and payment released!');
      loadTaskAndMilestones();
    }).catch(err => {
      const msg = err.response?.data || err.message;
      alert("Error approving milestone: " + msg);
    });
  };

  const handleRejectMilestone = (milestoneId) => {
    const reason = rejectionReasons[milestoneId];
    if (!reason) {
      alert('Please enter feedback for rejection');
      return;
    }
    clientTaskService.rejectMilestone(milestoneId, { reason }).then(() => {
      alert('Milestone rejected');
      loadTaskAndMilestones();
    }).catch(err => {
      const msg = err.response?.data || err.message;
      alert("Error rejecting milestone: " + msg);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Milestones for {task?.title}</h2>
      <p>Budget: ${task?.totalBudget}</p>

      {milestones.length === 0 && (
        <button
          onClick={handleSuggestMilestones}
          style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          AI Suggest Milestones
        </button>
      )}

      <div style={{ marginTop: '20px' }}>
        {milestones.map(milestone => (
          <div key={milestone.id} style={{
            border: '1px solid #ddd',
            margin: '10px 0',
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: milestone.status === 'SUGGESTED' ? '#fff9c4' : '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{milestone.title}</h4>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{milestone.description}</p>
                <p style={{ margin: '5px 0 0 0' }}><strong>Amount:</strong> ${milestone.amount}</p>
                <p style={{ margin: '5px 0 0 0' }}><strong>Status:</strong> <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: milestone.status === 'PAID' ? '#c8e6c9' : (milestone.status === 'FUNDED' ? '#b3e5fc' : (milestone.status === 'REJECTED' ? '#ffcdd2' : '#eee')),
                  fontSize: '12px'
                }}>{milestone.status}</span></p>
                {milestone.submissionUrl && (
                  <p style={{ margin: '5px 0 0 0' }}><strong>Submission:</strong> <a href={milestone.submissionUrl} target="_blank" rel="noopener noreferrer">{milestone.submissionUrl}</a></p>
                )}
                {milestone.rejectionReason && (
                  <p style={{ margin: '5px 0 0 0', color: '#d32f2f', fontSize: '13px' }}><strong>Rejection Reason:</strong> {milestone.rejectionReason}</p>
                )}
              </div>

              <div>
                {milestone.status === 'SUGGESTED' && (
                  <input
                    type="checkbox"
                    checked={selectedMilestones.includes(milestone.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedMilestones([...selectedMilestones, milestone.id]);
                      } else {
                        setSelectedMilestones(selectedMilestones.filter(id => id !== milestone.id));
                      }
                    }}
                    style={{ transform: 'scale(1.5)' }}
                  />
                )}
                {milestone.status === 'SUBMITTED' && (
                  <div style={{
                    marginTop: '15px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '12px',
                    border: '1px solid #eee',
                    width: '100%'
                  }}>
                    <h5 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#333' }}>Review Milestone Work</h5>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>Feedback for Freelancer (Optional for approval):</label>
                    <textarea
                      placeholder="Explain what needs to be improved or why you are approving..."
                      value={rejectionReasons[milestone.id] || ''}
                      onChange={(e) => handleReasonChange(milestone.id, e.target.value)}
                      style={{
                        width: '100%',
                        height: '80px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        marginBottom: '15px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleApproveMilestone(milestone.id)}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          padding: '12px 20px',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        APPROVE & PAY
                      </button>
                      <button
                        onClick={() => handleRejectMilestone(milestone.id)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          padding: '12px 20px',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          flex: 1
                        }}
                      >
                        REJECT WORK
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {milestones.some(m => m.status === 'SUGGESTED') && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            onClick={handleConfirmMilestones}
            style={{ padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Confirm & Fund Selected Milestonestf
          </button>
        </div>
      )}
    </div>
  );
};
