import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

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

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <table>
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
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>${task.budget}</td>
                <td>{task.deadline.split('T')[0]}</td>
                <td>
                  <button onClick={() => setSelectedTask(task)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTask && (
        <div>
          <h3>{selectedTask.title}</h3>
          <p>{selectedTask.description}</p>
          <p>Status: {selectedTask.status}</p>
          <p>Budget: ${selectedTask.budget}</p>
          <p>Deadline: {selectedTask.deadline.split('T')[0]}</p>
          <button onClick={() => setSelectedTask(null)}>Close</button>
        </div>
      )}
    </div>
  );
};
