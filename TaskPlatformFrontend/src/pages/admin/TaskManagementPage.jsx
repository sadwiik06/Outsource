import React, { useState, useEffect } from 'react';
import api from '../../config/api';

export const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  const fetchTasks = async () => {
    try {
      let response;
      if (filterStatus) {
        response = await api.get(`/admin/tasks/status/${filterStatus}`);
      } else {
        response = await api.get('/admin/tasks');
      }
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
    setLoading(false);
  };

  const handleCancel = async (taskId) => {
    const reason = prompt('Enter cancellation reason:');
    if (reason) {
      try {
        await api.post(`/admin/tasks/${taskId}/cancel`, reason);
        fetchTasks();
      } catch (err) {
        setError('Failed to cancel task');
      }
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Task Management</h2>
      <div>
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>${task.budget}</td>
              <td>
                {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
                  <button onClick={() => handleCancel(task.id)}>Cancel</button>
                )}
                <button onClick={() => setSelectedTask(task)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTask && (
        <div>
          <h3>{selectedTask.title}</h3>
          <p>{selectedTask.description}</p>
          <p>Status: {selectedTask.status}</p>
          <p>Budget: ${selectedTask.budget}</p>
          <button onClick={() => setSelectedTask(null)}>Close</button>
        </div>
      )}
    </div>
  );
};
