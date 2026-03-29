import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import './Auth.css';

export const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { setUser }             = useContext(AuthContext);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      const roleRoute = {
        ADMIN:      '/admin/dashboard',
        CLIENT:     '/client/dashboard',
        FREELANCER: '/freelancer/dashboard',
      };
      navigate(roleRoute[userData.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            <div className="auth-tag">Secure Login</div>
            <h1 className="auth-panel-h">Work, tracked.<br /><em>Results, delivered.</em></h1>
            <p className="auth-panel-p">
              Milestone-driven contracts, transparent payments,
              and real-time oversight — all in one place.
            </p>
            <div className="auth-panel-stats">
              <div className="auth-pstat">
                <span className="auth-pstat-v">12K+</span>
                <span className="auth-pstat-l">Active Projects</span>
              </div>
              <div className="auth-pstat">
                <span className="auth-pstat-v">$4.2M</span>
                <span className="auth-pstat-l">Paid Out</span>
              </div>
              <div className="auth-pstat">
                <span className="auth-pstat-v">98%</span>
                <span className="auth-pstat-l">Satisfaction</span>
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
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-sub">Sign in to access your dashboard</p>
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
                autoComplete="email"
                placeholder="johndoe@company.com"
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
                <><span className="auth-spinner" /> Signing in...</>
              ) : (
                <>Sign in →</>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};