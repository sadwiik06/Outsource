import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

export const FreelancerSubmitPage = () => {
    const { milestoneId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [milestone, setMilestone] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.id && milestoneId) {
            fetchMilestone();
        }
    }, [user, milestoneId]);

    const fetchMilestone = async () => {
        try {
            // We can use the generic milestones endpoint and filter, or a specific one if exists
            const res = await api.get(`/freelancer/milestones/${user.id}`);
            const m = res.data.find(item => item.id.toString() === milestoneId);
            if (m) {
                setMilestone(m);
                setSubmissionUrl(m.submissionUrl || '');
            } else {
                setError('Milestone not found or not assigned to you.');
            }
        } catch (err) {
            setError('Failed to fetch milestone details.');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submissionUrl) {
            alert('Please enter a submission URL');
            return;
        }
        try {
            await api.post(`/freelancer/submit-milestone/${milestoneId}`, { submissionUrl }, {
                headers: { 'X-User-Id': user.id },
            });
            alert('SUCCESS! Milestone submitted to client.');
            navigate('/freelancer/dashboard');
        } catch (err) {
            alert('Failed to submit. Please check if milestone is in a valid state (Suggested, Funded, or Rejected).');
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    if (!milestone) return <div style={{ padding: '20px' }}>No milestone found.</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>← Back</button>

            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
                <h2 style={{ marginTop: 0, color: '#2196F3' }}>Submit Work for Milestone</h2>
                <hr style={{ borderColor: '#f0f0f0', margin: '20px 0' }} />

                <div style={{ marginBottom: '20px' }}>
                    <h3>{milestone.taskTitle}</h3>
                    <p><strong>Milestone:</strong> {milestone.title}</p>
                    <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: '#2196F3' }}>{milestone.status}</span></p>
                    <p><strong>Amount:</strong> ${milestone.amount}</p>
                    {milestone.rejectionReason && (
                        <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f44336', marginTop: '10px' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#d32f2f' }}>Feedback to Address:</h4>
                            <p style={{ margin: 0 }}>{milestone.rejectionReason}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Submission URL (GitHub, Drive, Figma, etc.):
                    </label>
                    <input
                        type="text"
                        placeholder="https://github.com/your-repo / https://figma.com/..."
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: '2px solid #2196F3',
                            marginBottom: '20px',
                            boxSizing: 'border-box'
                        }}
                        required
                    />

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '1.2rem',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        CONFIRM AND SUBMIT WORK
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                    The client will be notified immediately upon submission.
                </p>
            </div>
        </div>
    );
};
