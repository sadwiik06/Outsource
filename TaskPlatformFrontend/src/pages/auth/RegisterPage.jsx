import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../config/api';
import './Auth.css';

export const RegisterPage = () => {
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]                     = useState('CLIENT');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const navigate                            = useNavigate();

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
    <div className="auth-root">
      {/* Left panel — branding */}
      <div className="auth-panel auth-panel-left">
        <div className="auth-panel-inner">
          <a href="/" className="auth-logo">
            <span className="auth-logo-mark">⬡</span>
            TaskPlatform
          </a>
          <div className="auth-panel-body">
            <div className="auth-tag">Get Started Free</div>
            <h1 className="auth-panel-h">Join thousands<br /><em>shipping faster.</em></h1>
            <p className="auth-panel-p">
              Whether you're a client looking for talent or a freelancer
              ready to build — TaskPlatform has your workflow covered.
            </p>

            {/* Role explainer */}
            <div className="auth-role-cards">
              <div className={`auth-role-card ${role === 'CLIENT' ? 'is-selected' : ''}`}
                onClick={() => setRole('CLIENT')}>
                <span className="auth-role-icon">◈</span>
                <div>
                  <div className="auth-role-name">Client</div>
                  <div className="auth-role-desc">Post tasks & hire talent</div>
                </div>
                {role === 'CLIENT' && <span className="auth-role-check">✓</span>}
              </div>
              <div className={`auth-role-card ${role === 'FREELANCER' ? 'is-selected' : ''}`}
                onClick={() => setRole('FREELANCER')}>
                <span className="auth-role-icon">◉</span>
                <div>
                  <div className="auth-role-name">Freelancer</div>
                  <div className="auth-role-desc">Find work & get paid</div>
                </div>
                {role === 'FREELANCER' && <span className="auth-role-check">✓</span>}
              </div>
            </div>
          </div>
          <div className="auth-panel-stripe" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel auth-panel-right">
        <div className="auth-form-wrap">
          <div className="auth-form-head">
            <h2 className="auth-form-title">Create an account</h2>
            <p className="auth-form-sub">Join as a client or freelancer</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-error">
                <span className="auth-error-icon">!</span>
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
                placeholder="johndoe@company.com"
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">I want to</label>
              <div className="auth-role-toggle">
                <button
                  type="button"
                  className={`auth-toggle-btn ${role === 'CLIENT' ? 'is-active' : ''}`}
                  onClick={() => setRole('CLIENT')}
                >
                  ◈ Hire talent
                </button>
                <button
                  type="button"
                  className={`auth-toggle-btn ${role === 'FREELANCER' ? 'is-active' : ''}`}
                  onClick={() => setRole('FREELANCER')}
                >
                  ◉ Find work
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirm password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`auth-btn-submit ${loading ? 'is-loading' : ''}`}
            >
              {loading ? (
                <><span className="auth-spinner" /> Creating account...</>
              ) : (
                <>Create account →</>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};