import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

export const FreelancerDashboard = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionUrls, setSubmissionUrls] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchStatsTasksAndMilestones();
    }
  }, [user]);

  const fetchStatsTasksAndMilestones = async () => {
    try {
      const statsRes = await api.get(`/freelancer/stats/${user.id}`);
      setStats(statsRes.data);
      const tasksRes = await api.get(`/freelancer/tasks/${user.id}`);
      setTasks(tasksRes.data);
      const milestoneRes = await api.get(`/freelancer/milestones/${user.id}`);
      setMilestones(milestoneRes.data);

      const urls = {};
      milestoneRes.data.forEach(m => {
        urls[m.id] = m.submissionUrl || '';
      });
      setSubmissionUrls(urls);
      refreshUser(); // Sync balance automatically
    } catch (err) {
      console.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleUrlChange = (id, url) => {
    setSubmissionUrls(prev => ({ ...prev, [id]: url }));
  };

  const handleSubmit = async (milestoneId) => {
    const url = submissionUrls[milestoneId];
    if (!url) {
      alert('Please enter a submission URL');
      return;
    }
    try {
      await api.post(`/freelancer/submit-milestone/${milestoneId}`, { submissionUrl: url }, {
        headers: { 'X-User-Id': user.id },
      });
      alert('Milestone submitted successfully!');
      fetchStatsTasksAndMilestones();
    } catch (err) {
      alert('Failed to submit milestone');
    }
  };

  const actionableMilestones = milestones.filter(m => ['SUGGESTED', 'FUNDED', 'REJECTED', 'CREATED'].includes(m.status));

  return (
    <div style={{ padding: '20px' }}>
      <h2>Freelancer Dashboard</h2>
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Welcome, {user?.email}</h3>
        <p><strong>Freelancer ID:</strong> {user?.id}</p>
      </div>

      <nav style={{ marginBottom: '20px' }}>
        <a href="/freelancer/profile" style={{ marginRight: '10px' }}>Profile</a>
        <a href="/freelancer/tasks" style={{ marginRight: '10px' }}>All Tasks</a>
        <a href="/freelancer/milestones" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Go to My Milestones & Submissions
        </a>
      </nav>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#d32f2f' }}>⚠️ Milestones Needing Your Action</h3>
        {actionableMilestones.length === 0 ? (
          <p>You have no pending milestones to submit.</p>
        ) : (
          actionableMilestones.map(m => (
            <div key={m.id} style={{ border: '2px solid #ffcdd2', padding: '15px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#fff9f9' }}>
              <h4>{m.taskTitle} - {m.title}</h4>
              <p><strong>Status:</strong> <span style={{ color: m.status === 'REJECTED' ? '#d32f2f' : '#2196F3' }}>{m.status}</span></p>
              {m.rejectionReason && (
                <div style={{
                  backgroundColor: '#ffebee',
                  padding: '15px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #f44336',
                  marginTop: '10px',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>🚩</span> Fix Required:
                  </h4>
                  <p style={{ margin: 0, color: '#333' }}>{m.rejectionReason}</p>
                </div>
              )}
              <a
                href={`/freelancer/submit/${m.id}`}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                {m.status === 'REJECTED' ? 'RE-SUBMIT WORK NOW →' : 'SUBMIT WORK NOW →'}
              </a>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Ongoing Tasks</h3>
        {tasks.length === 0 ? <p>No tasks assigned yet.</p> : tasks.map(task => (
          <div key={task.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
            <h4>{task.title}</h4>
            <p><strong>Status:</strong> {task.status}</p>
            <a
              href="/freelancer/milestones"
              style={{ display: 'inline-block', marginTop: '10px', color: '#2196F3', fontWeight: 'bold' }}
            >
              Full Milestone View →
            </a>
          </div>
        ))}
      </section>
    </div>
  );
};
