import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { clientTaskService } from '../../services/taskService';
import api from '../../config/api';

export const ClientDashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = () => {
    clientTaskService.getTasksByClientId(user.id).then(response => {
      setTasks(response.data);
    });
    clientTaskService.getFreelancersWithPerformance().then(response => {
      setFreelancers(response.data);
    });
    clientTaskService.getClientMilestones(user.id).then(response => {
      setMilestones(response.data);
    });
    refreshUser(); // Sync balance
  };

  const handleReasonChange = (id, reason) => {
    setRejectionReasons(prev => ({ ...prev, [id]: reason }));
  };

  const handleApprove = (milestoneId) => {
    const message = rejectionReasons[milestoneId]; // Reuse the same textarea content
    clientTaskService.approveMilestone(milestoneId, { message }).then(() => {
      alert('Milestone approved and payment released!');
      handleReasonChange(milestoneId, '');
      fetchData();
    }).catch(err => {
      const msg = err.response?.data || err.message;
      alert("Error approving: " + msg);
    });
  };

  const handleReject = (milestoneId) => {
    const reason = rejectionReasons[milestoneId];
    if (!reason) {
      alert('Please enter a feedback reason for rejection.');
      return;
    }
    clientTaskService.rejectMilestone(milestoneId, { reason }).then(() => {
      alert('Milestone rejected with feedback.');
      handleReasonChange(milestoneId, '');
      fetchData();
    }).catch(err => {
      const msg = err.response?.data || err.message;
      alert("Error rejecting: " + msg);
    });
  };

  const handleAssign = (freelancerId) => {
    if (selectedTask) {
      clientTaskService.assignFreelancer(selectedTask.id, freelancerId).then(() => {
        alert('Freelancer assigned successfully!');
        setSelectedTask(null);
        fetchData();
      });
    }
  };

  const openTasks = tasks.filter(task => task.status === 'OPEN');
  const ongoingTasks = tasks.filter(task => task.status === 'IN_PROGRESS');

  return (
    <div>
      <h2>Client Dashboard</h2>
      <div>
        <h3>Welcome, {user?.email}</h3>
      </div>
      <nav>
        <a href="/client/create-task" style={{ marginRight: '10px' }}>Create Task</a>
        <a href="/client/tasks" style={{ marginRight: '10px' }}>My Tasks</a>
        <a href="/client/milestones">All Milestones</a>
      </nav>

      <section style={{ marginTop: '20px', marginBottom: '30px' }}>
        <h3 style={{ color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span> Milestones Needing Your Review
        </h3>
        {milestones.filter(m => m.status === 'SUBMITTED').length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No milestones awaiting your review.</p>
        ) : (
          milestones.filter(m => m.status === 'SUBMITTED').map(m => (
            <div key={m.id} style={{
              border: '1px solid #ffccbc',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '15px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{m.taskTitle} - {m.title}</h4>
                  <p><strong>Work Submitted:</strong> <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3', fontWeight: 'bold' }}>{m.submissionUrl}</a></p>
                </div>
                <span style={{ backgroundColor: '#fff9c4', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>AWAITING REVIEW</span>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #eee' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Review Feedback (Optional for approval, Required if rejecting):</label>
                <textarea
                  placeholder="Tell the freelancer what's good or what needs fixing..."
                  value={rejectionReasons[m.id] || ''}
                  onChange={(e) => handleReasonChange(m.id, e.target.value)}
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    marginBottom: '15px'
                  }}
                />

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => handleApprove(m.id)}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flex: 1
                    }}
                  >
                    🚀 APPROVE & PAY ${m.amount}
                  </button>
                  <button
                    onClick={() => handleReject(m.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flex: 1
                    }}
                  >
                    ❌ REJECT WORK
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <section style={{ marginTop: '20px' }}>
        <h3>Ongoing Tasks (In Progress)</h3>
        {ongoingTasks.length === 0 ? <p>No ongoing tasks.</p> : ongoingTasks.map(task => (
          <div key={task.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
            <h4>{task.title}</h4>
            <p><strong>Status:</strong> {task.status}</p>
            <a
              href={`/client/task/${task.id}/milestones`}
              style={{ display: 'inline-block', marginTop: '10px', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
            >
              Manage Milestones & Payments
            </a>
          </div>
        ))}
      </section>

      <section style={{ marginTop: '20px' }}>
        <h3>Open Tasks (Awaiting Assignment)</h3>
        {openTasks.length === 0 ? <p>No open tasks.</p> : openTasks.map(task => (
          <div key={task.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <button onClick={() => setSelectedTask(task)} style={{ marginTop: '10px' }}>Assign Freelancer</button>
          </div>
        ))}
      </section>

      {selectedTask && (
        <section>
          <h3>Assign Freelancer for "{selectedTask.title}"</h3>
          {freelancers.map(freelancer => (
            <div key={freelancer.id}>
              <p>Email: {freelancer.email}</p>
              <p>Performance Level: {freelancer.performance?.performanceLevel || 'N/A'}</p>
              <button onClick={() => handleAssign(freelancer.id)}>Assign</button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
