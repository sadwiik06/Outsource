import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import './Freelancer.css';

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

    if (loading) return <div className="freelancer-container"><div className="freelancer-empty-state">Loading milestone...</div></div>;
    if (error) return <div className="freelancer-container"><div className="freelancer-empty-state text-red-600">{error}</div></div>;
    if (!milestone) return <div className="freelancer-container"><div className="freelancer-empty-state">No milestone found.</div></div>;

    const getStatusClass = (status) => {
        switch (status) {
            case 'PAID': return 'status-paid';
            case 'FUNDED': return 'status-funded';
            case 'REJECTED': return 'status-rejected';
            case 'SUBMITTED': return 'status-submitted';
            default: return 'status-default';
        }
    };

    return (
        <div className="freelancer-container !max-w-3xl">
            <button
                onClick={() => navigate(-1)}
                className="btn-secondary w-fit text-sm mb-2 hover:bg-neutral-100"
            >
                ← Back to Dashboard
            </button>

            <div className="freelancer-details-card !mt-0">
                <div className="freelancer-details-header">
                    <h3>Submit Work for Milestone</h3>
                </div>

                <div className="freelancer-details-content">
                    <h4 className="text-xl font-semibold text-neutral-900">{milestone.taskTitle}</h4>
                    <p><strong>Milestone:</strong> {milestone.title}</p>
                    <p className="flex items-center gap-2">
                        <strong>Status:</strong>
                        <span className={`freelancer-status-badge ${getStatusClass(milestone.status)}`}>
                            {milestone.status}
                        </span>
                    </p>
                    <p><strong>Amount:</strong> ${milestone.amount}</p>

                    {milestone.rejectionReason && (
                        <div className="freelancer-feedback-alert">
                            <h4>Feedback to Address:</h4>
                            <p>{milestone.rejectionReason}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="freelancer-submit-form">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Submission URL (GitHub, Drive, Figma, etc.):
                    </label>
                    <input
                        type="url"
                        placeholder="https://github.com/your-repo or https://figma.com/..."
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="freelancer-input mb-4"
                        required
                    />

                    <button
                        type="submit"
                        className="btn-primary w-full py-4 text-base"
                    >
                        CONFIRM AND SUBMIT WORK
                    </button>

                    <p className="text-center text-xs text-neutral-500 mt-4">
                        The client will be notified immediately upon submission.
                    </p>
                </form>
            </div>
        </div>
    );
};
