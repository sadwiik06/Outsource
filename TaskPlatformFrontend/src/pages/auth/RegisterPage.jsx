import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../config/api';
import './Auth.css';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">
            Join the platform as a client or freelancer
          </p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex. johndoe@company.com"
                className="w-full border border-neutral-200 rounded-lg px-4 py-2 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="auth-select"
              >
                <option value="CLIENT">Client - I want to hire talent</option>
                <option value="FREELANCER">Freelancer - I want to work</option>
                {/* Keeping Admin hidden by default as discussed unless specifically needed */}
              </select>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-neutral-200 rounded-lg px-4 py-2 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-neutral-200 rounded-lg px-4 py-2 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${loading ? 'auth-button-loading' : ''}`}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
