import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import '../Dashboard.css';
import './Client.css';

export const CreateTaskPage = () => {
  const { user }    = useContext(AuthContext);
  const navigate    = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', budget: '',
    deadline: '', category: '',
  });
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post('/client/tasks', {
        title:       formData.title,
        description: formData.description,
        totalBudget: parseFloat(formData.budget),
        deadline:    `${formData.deadline}T23:59:59`,
        category:    formData.category,
        clientId:    user.id,
        status:      'OPEN',
      });
      setMessage({ text: '✓ Task created successfully!', type: 'success' });
      setFormData({ title: '', description: '', budget: '', deadline: '', category: '' });
      setTimeout(() => navigate('/client/tasks'), 1200);
    } catch (err) {
      setMessage({
        text: 'Error: ' + (err.response?.data?.message || err.message),
        type: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container" style={{ maxWidth: '760px' }}>

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Create New Task</h2>
            <p className="dashboard-header-text">
              Define your project and let the platform match you with freelancers.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background: 'var(--white)',
          border: '2px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: '32px',
          boxShadow: 'var(--shadow-brut-md)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Accent stripe */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'repeating-linear-gradient(90deg, var(--accent) 0, var(--accent) 10px, transparent 10px, transparent 14px)',
          }} />

          {/* Message banner */}
          {message.text && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              border: '2px solid',
              borderRadius: 'var(--r)',
              fontFamily: 'var(--font-d)',
              fontSize: '13px',
              fontWeight: 700,
              ...(message.type === 'success'
                ? { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d', boxShadow: '3px 3px 0 #bbf7d0' }
                : { background: '#fff1f2', borderColor: '#fecdd3', color: '#be123c', boxShadow: '3px 3px 0 #fecdd3' }
              ),
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            <div className="dash-field" style={{ marginBottom: 0 }}>
              <label className="dash-label">Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Build a React dashboard component"
                className="dash-input"
                required
              />
            </div>

            <div className="dash-field" style={{ marginBottom: 0 }}>
              <label className="dash-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the scope, goals, and requirements in detail…"
                className="dash-textarea"
                rows={5}
                required
              />
            </div>

            {/* Two-column row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="dash-field" style={{ marginBottom: 0 }}>
                <label className="dash-label">Budget ($)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  className="dash-input"
                  step="0.01"
                  min="1"
                  required
                />
              </div>
              <div className="dash-field" style={{ marginBottom: 0 }}>
                <label className="dash-label">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="dash-input"
                  required
                />
              </div>
            </div>

            <div className="dash-field" style={{ marginBottom: 0 }}>
              <label className="dash-label">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Web Development, Design, Data Science…"
                className="dash-input"
                required
              />
            </div>

            <div style={{
              paddingTop: '8px',
              borderTop: '2px dashed var(--border-light)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Creating…' : 'Create Task →'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};