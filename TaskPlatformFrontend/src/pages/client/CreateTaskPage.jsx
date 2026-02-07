import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

export const CreateTaskPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const task = {
        title: formData.title,
        description: formData.description,
        totalBudget: parseFloat(formData.budget),
        deadline: `${formData.deadline}T23:59:59`,
        category: formData.category,
        clientId: user.id,
        status: 'OPEN',
      };
      
      await api.post('/client/tasks', task);
      setMessage('Task created successfully!');
      setFormData({ title: '', description: '', budget: '', deadline: '', category: '' });
    } catch (error) {
      setMessage('Error creating task: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Create New Task</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label>Deadline:</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};
