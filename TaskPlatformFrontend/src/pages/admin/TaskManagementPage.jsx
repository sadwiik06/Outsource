import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import '../Dashboard.css';
import './Admin.css';

const getTaskStatusClass = (s) => ({
  OPEN:        'status-default',
  IN_PROGRESS: 'status-funded',
  COMPLETED:   'status-completed',
  CANCELLED:   'status-rejected',
})[s] || 'status-default';

export const TaskManagementPage = () => {
  const [tasks, setTasks]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [selectedTask, setSelectedTask]     = useState(null);

  useEffect(() => { fetchTasks(); }, [filterStatus]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = filterStatus
        ? await api.get(`/admin/tasks/status/${filterStatus}`)
        : await api.get('/admin/tasks');
      setTasks(res.data);
    } catch { setError('Failed to fetch tasks'); }
    setLoading(false);
  };

  const handleCancel = async (taskId) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/tasks/${taskId}/cancel`, reason);
      fetchTasks();
    } catch { setError('Failed to cancel task'); }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) setSelectedTask(null);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Task Management</h2>
            <p className="dashboard-header-text">View, filter, and manage all platform tasks.</p>
          </div>
        </div>

        {/* Filter */}
        <div style={{
          display: 'flex', gap: '12px', alignItems: 'flex-end',
          padding: '16px 20px', background: 'var(--white)',
          border: '2px solid var(--border)', borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow-brut)',
        }}>
          <div className="dash-field" style={{ marginBottom: 0, minWidth: '200px' }}>
            <label className="dash-label">Filter by status</label>
            <select className="dash-select" value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All tasks</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? <div className="dash-loading">Loading tasks...</div>
          : error ? <div className="empty-state" style={{ color: 'var(--red)' }}>{error}</div>
          : tasks.length === 0 ? <div className="empty-state">No tasks found.</div>
          : (
          <div className="table-container">
            <table className="dash-table">
              <thead>
                <tr><th>ID</th><th>Title</th><th>Status</th><th>Budget</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: 'var(--ink-3)', fontSize: '12px' }}>
                      #{t.id}
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title}
                    </td>
                    <td>
                      <span className={`status-badge ${getTaskStatusClass(t.status)}`}>{t.status}</span>
                    </td>
                    <td><span className="payment-amount">${t.budget}</span></td>
                    <td>
                      <div className="admin-user-actions">
                        {t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (
                          <button className="btn-suspend" onClick={() => handleCancel(t.id)}>
                            ✕ Cancel
                          </button>
                        )}
                        <button className="freelancer-action-btn" onClick={() => setSelectedTask(t)}>
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

        {/* Detail modal */}
        {selectedTask && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">{selectedTask.title}</div>
                <button className="modal-close" onClick={() => setSelectedTask(null)}>✕</button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {selectedTask.description && (
                  <p style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.65 }}>
                    {selectedTask.description}
                  </p>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-detail-card" style={{ padding: '16px' }}>
                    <div className="freelancer-info-card-label">Budget</div>
                    <div className="freelancer-info-card-value" style={{ color: 'var(--accent-3)', marginTop: '4px' }}>
                      ${selectedTask.budget}
                    </div>
                  </div>
                  <div className="admin-detail-card" style={{ padding: '16px' }}>
                    <div className="freelancer-info-card-label">Status</div>
                    <div style={{ marginTop: '8px' }}>
                      <span className={`status-badge ${getTaskStatusClass(selectedTask.status)}`}>
                        {selectedTask.status}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedTask.status !== 'COMPLETED' && selectedTask.status !== 'CANCELLED' && (
                  <button className="btn-danger btn-full"
                    onClick={() => { handleCancel(selectedTask.id); setSelectedTask(null); }}>
                    ✕ Cancel This Task
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};