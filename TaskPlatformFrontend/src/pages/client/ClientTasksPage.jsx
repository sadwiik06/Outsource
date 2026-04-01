import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { clientTaskService } from '../../services/taskService';
import '../Dashboard.css';
import './Client.css';

export const ClientTasksPage = () => {
  const { user }        = useContext(AuthContext);
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [ratingModalTask, setRatingModalTask] = useState(null);
  const [ratingData, setRatingData] = useState({ rating: 5, review: '' });

  const loadTasks = () => {
    if (user?.id) {
      clientTaskService.getTasksByClientId(user.id)
        .then(r => setTasks(r.data))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleRateSubmit = () => {
    if (!ratingModalTask) return;
    clientTaskService.rateFreelancer(ratingModalTask.id, ratingData)
      .then(() => {
        alert('Freelancer rated successfully');
        setRatingModalTask(null);
        setRatingData({ rating: 5, review: '' });
        loadTasks();
      })
      .catch(err => alert('Error: ' + err.message));
  };

  const getStatusClass = (status) => ({
    OPEN:        'status-default',
    IN_PROGRESS: 'status-funded',
    COMPLETED:   'status-completed',
    CANCELLED:   'status-rejected',
  })[status] || 'status-default';

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container"><div className="dash-loading">Loading tasks...</div></div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>My Tasks</h2>
            <p className="dashboard-header-text">All tasks you've posted on the platform.</p>
          </div>
          <div className="dashboard-header-actions">
            <Link to="/client/create-task" className="btn-primary">+ Create Task</Link>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            No tasks yet — create your first task to get started.
          </div>
        ) : (
          <div className="table-container">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-d)', fontWeight: 700,
                        fontSize: '14px', color: 'var(--ink)',
                      }}>
                        {task.title}
                      </span>
                    </td>
                    <td style={{
                      color: 'var(--ink-3)', fontSize: '13px',
                      maxWidth: '320px', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {task.description}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {task.status === 'COMPLETED' && !task.clientRating && (
                        <button
                          className="btn-primary btn-sm"
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                          onClick={() => {
                            setRatingModalTask(task);
                            setRatingData({ rating: 5, review: '' });
                          }}
                        >
                          ⭐ Rate Freelancer
                        </button>
                      )}
                      {task.clientRating && (
                        <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 700 }}>
                          {'⭐'.repeat(task.clientRating)} Given
                        </span>
                      )}
                      {task.status !== 'COMPLETED' && (
                        <Link
                          to={`/client/task/${task.id}/milestones`}
                          className="freelancer-action-btn"
                        >
                          Manage Milestones →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {ratingModalTask && (
        <div className="modal-overlay" onClick={(e) => { if(e.target.classList.contains('modal-overlay')) setRatingModalTask(null); }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <div className="modal-title">Rate Freelancer</div>
              <button className="modal-close" onClick={() => setRatingModalTask(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)' }}>
                How would you rate the work for <strong>{ratingModalTask.title}</strong>?
              </p>
              
              <div>
                <label className="auth-label">Stars</label>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRatingData(prev => ({ ...prev, rating: star }))}
                      style={{
                        background: 'none', border: 'none',
                        fontSize: '24px', cursor: 'pointer',
                        color: star <= ratingData.rating ? '#f59e0b' : '#cbd5e1',
                        transition: 'color 0.2s'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="auth-label">Review (Optional)</label>
                <textarea
                  className="auth-input"
                  style={{ minHeight: '80px', paddingTop: '10px' }}
                  placeholder="Leave a short review..."
                  value={ratingData.review}
                  onChange={(e) => setRatingData(prev => ({ ...prev, review: e.target.value }))}
                />
              </div>

              <button className="btn-primary" style={{ width: '100%' }} onClick={handleRateSubmit}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};