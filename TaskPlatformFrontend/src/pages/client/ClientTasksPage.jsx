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

  useEffect(() => {
    if (user?.id) {
      clientTaskService.getTasksByClientId(user.id)
        .then(r => setTasks(r.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

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
                    <td>
                      <Link
                        to={`/client/task/${task.id}/milestones`}
                        className="freelancer-action-btn"
                      >
                        Manage Milestones →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};