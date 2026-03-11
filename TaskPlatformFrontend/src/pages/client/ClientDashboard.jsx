import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { clientTaskService } from '../../services/taskService';
import { Link } from 'react-router-dom';
import '../Dashboard.css';

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
    <div className="dashboard-container">

      {/* Header Area */}
      <div className="dashboard-header">
        <div className="dashboard-header-title">
          <h2 className="heading-1 !mb-0">Client Dashboard</h2>
          <p className="dashboard-header-text">Welcome back, {user?.email}</p>
        </div>
        <div className="dashboard-header-actions">
          <Link to="/client/create-task" className="btn-secondary">Create Task</Link>
          <Link to="/client/tasks" className="btn-secondary">My Tasks</Link>
          <Link to="/client/milestones" className="btn-primary">All Milestones</Link>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-sidebar">

        {/* Main Content Area */}
        <div className="dashboard-main-content dashboard-section">

          <section>
            <div className="alert-header">
              <span className="alert-icon">⚠️</span>
              <h3 className="heading-2 alert-title">Milestones Needing Review</h3>
            </div>

            {milestones.filter(m => m.status === 'SUBMITTED').length === 0 ? (
              <div className="card empty-state">
                <p>No milestones awaiting your review at the moment.</p>
              </div>
            ) : (
              <div className="dashboard-list">
                {milestones.filter(m => m.status === 'SUBMITTED').map(m => (
                  <div key={m.id} className="card border-amber-200 bg-amber-50/10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                      <div>
                        <h4 className="list-item-title text-lg">{m.taskTitle} - {m.title}</h4>
                        <p className="text-sm mt-1">
                          <strong className="text-neutral-700">Work Submitted: </strong>
                          <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" className="list-item-link">
                            {m.submissionUrl}
                          </a>
                        </p>
                      </div>
                      <span className="badge badge-warning self-start">AWAITING REVIEW</span>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Review Feedback (Optional for approval, Required if rejecting):
                      </label>
                      <textarea
                        placeholder="Tell the freelancer what's good or what needs fixing..."
                        value={rejectionReasons[m.id] || ''}
                        onChange={(e) => handleReasonChange(m.id, e.target.value)}
                        className="mb-4 bg-white border border-neutral-200 rounded-lg p-3 w-full"
                        rows={3}
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleApprove(m.id)}
                          className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                          🚀 APPROVE & PAY ${m.amount}
                        </button>
                        <button
                          onClick={() => handleReject(m.id)}
                          className="flex-1 inline-flex justify-center items-center px-4 py-3 rounded-lg bg-white border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          ❌ REJECT WORK
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="heading-2">Open Tasks (Awaiting Assignment)</h3>
            {openTasks.length === 0 ? (
              <div className="card empty-state">No open tasks actively seeking freelancers.</div>
            ) : (
              <div className="dashboard-list">
                {openTasks.map(task => (
                  <div key={task.id} className="card list-item-card">
                    <h4 className="list-item-title text-lg">{task.title}</h4>
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{task.description}</p>
                    <button onClick={() => setSelectedTask(task)} className="btn-secondary text-sm">
                      Find Freelancer to Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Sidebar */}
        <div className="dashboard-section">

          <section>
            <h3 className="heading-2">Ongoing Tasks</h3>
            {ongoingTasks.length === 0 ? (
              <div className="card empty-state">No active ongoing tasks.</div>
            ) : (
              <div className="dashboard-list">
                {ongoingTasks.map(task => (
                  <div key={task.id} className="card list-item-card">
                    <h4 className="list-item-title">{task.title}</h4>
                    <div className="list-item-footer">
                      <span className="list-item-badge">
                        {task.status}
                      </span>
                      <Link
                        to={`/client/task/${task.id}/milestones`}
                        className="list-item-link"
                      >
                        Manage Milestones →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {selectedTask && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-neutral-900 rounded-xl p-5 text-white shadow-lg">
                <h3 className="font-semibold mb-1 text-neutral-100">Assign Freelancer</h3>
                <p className="text-neutral-400 text-sm mb-4">For "{selectedTask.title}"</p>

                <div className="space-y-3">
                  {freelancers.map(freelancer => (
                    <div key={freelancer.id} className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="text-sm font-medium">{freelancer.email}</div>
                        <div className="text-xs text-neutral-400 mt-1">Level: {freelancer.performance?.performanceLevel || 'N/A'}</div>
                      </div>
                      <button
                        onClick={() => handleAssign(freelancer.id)}
                        className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-semibold rounded hover:bg-neutral-200 transition-colors w-full sm:w-auto"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                  {freelancers.length === 0 && (
                    <div className="text-sm text-neutral-400 italic">No freelancers available.</div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  );
};
