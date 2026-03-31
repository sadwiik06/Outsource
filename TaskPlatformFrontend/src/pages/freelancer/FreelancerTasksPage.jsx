import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import './Freelancer.css';

export const FreelancerTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/freelancer/tasks/${user.id}`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
    setLoading(false);
  };

  if (loading) return <div className="freelancer-container"><div className="freelancer-empty-state">Loading tasks...</div></div>;
  if (error) return <div className="freelancer-container"><div className="freelancer-empty-state text-red-600">{error}</div></div>;

  return (
    <div className="freelancer-container">
      <div className="freelancer-header">
        <h2>My Assigned Tasks</h2>
        <p>Review the tasks you are currently working on.</p>
      </div>

      {tasks.length === 0 ? (
        <div className="freelancer-empty-state">No tasks assigned yet.</div>
      ) : (
        <div className="freelancer-table-container">
          <table className="freelancer-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="font-medium">{task.title}</td>
                  <td>
                    <span className="freelancer-status-badge status-default">
                      {task.status}
                    </span>
                  </td>
                  <td>${task.totalBudget}</td>
                  <td>{task.deadline.split('T')[0]}</td>
                  <td>
                    <button
                      className="freelancer-action-btn"
                      onClick={() => setSelectedTask(task)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTask && (
        <div className="freelancer-details-card animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="freelancer-details-header">
            <h3>{selectedTask.title}</h3>
            <button
              className="btn-secondary text-sm"
              onClick={() => setSelectedTask(null)}
            >
              Close
            </button>
          </div>
          <div className="freelancer-details-content">
            <p className="text-neutral-600 mb-4">{selectedTask.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="freelancer-info-card !p-4 !shadow-none">
                <div className="freelancer-info-card-label">Status</div>
                <div className="freelancer-info-card-value text-base">{selectedTask.status}</div>
              </div>
              <div className="freelancer-info-card !p-4 !shadow-none">
                <div className="freelancer-info-card-label">Budget</div>
                <div className="freelancer-info-card-value text-base">${selectedTask.totalBudget}</div>
              </div>
              <div className="freelancer-info-card !p-4 !shadow-none">
                <div className="freelancer-info-card-label">Deadline</div>
                <div className="freelancer-info-card-value text-base">{selectedTask.deadline.split('T')[0]}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
