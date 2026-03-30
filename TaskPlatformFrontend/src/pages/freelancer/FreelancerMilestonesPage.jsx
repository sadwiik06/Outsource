import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import '../Dashboard.css';
import './Freelancer.css';

export const FreelancerMilestonesPage = () => {
  const { user } = useContext(AuthContext);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) fetchMilestones();
  }, [user]);

  const fetchMilestones = async () => {
    try {
      const res = await api.get(`/freelancer/milestones/${user.id}`);
      setMilestones(res.data);
    } catch {
      setError('Failed to fetch milestones.');
    }
    setLoading(false);
  };

  const getStatusClass = (status) => ({
    PAID: 'status-paid',
    APPROVED: 'status-paid',
    FUNDED: 'status-funded',
    REJECTED: 'status-rejected',
    SUBMITTED: 'status-submitted',
  })[status] || 'status-default';

  if (loading) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container"><div className="dash-loading">Loading milestones...</div></div>
    </div>
  );

  if (error) return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="empty-state" style={{ color: 'var(--red)' }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>My Milestones</h2>
            <p className="dashboard-header-text">Review and submit work for your assigned milestones.</p>
          </div>
        </div>

        {milestones.length === 0 ? (
          <div className="empty-state">No milestones assigned to you yet.</div>
        ) : (
          <div className="table-container">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Milestone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.taskTitle}</td>
                    <td style={{ color: 'var(--ink-2)' }}>{m.title}</td>
                    <td>
                      <span style={{
                        fontFamily: 'var(--font-d)', fontWeight: 700,
                        fontSize: '14px', color: 'var(--accent-3)',
                      }}>
                        ${m.amount}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(m.status)}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      {!['APPROVED', 'PAID', 'SUBMITTED'].includes(m.status) ? (
                        <Link
                          to={`/freelancer/submit/${m.id}`}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '13px', textDecoration: 'none', display: 'inline-block' }}
                        >
                          Submit
                        </Link>
                      ) : (
                        <span style={{ color: 'var(--ink-3)', fontSize: '13px', fontWeight: 500 }}>
                          {m.status === 'SUBMITTED' ? 'Under Review' : 'Completed'}
                        </span>
                      )}
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
