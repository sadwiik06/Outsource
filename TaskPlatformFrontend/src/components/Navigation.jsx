import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navigation.css';

export const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
      >
        {children}
      </Link>
    );
  };

  if (!user) {
    return (
      <header className="nav-header">
        <div className="nav-container">
          <div className="nav-wrapper">
            <div className="nav-brand">
              <Link to="/" className="nav-brand-link">OutSource.</Link>
            </div>
            <div className="nav-auth-wrapper">
              <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Log in</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Sign up</Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const navLinks = {
    ADMIN: [
      { label: 'Dashboard', to: '/admin/dashboard' },
      { label: 'Users', to: '/admin/users' },
      // { label: 'Tasks', to: '/admin/tasks' },
      { label: 'Payments', to: '/admin/payments' },
      { label: 'Performance', to: '/admin/performance' },
      { label: 'Audits', to: '/admin/audits' },
    ],
    CLIENT: [
      { label: 'Dashboard', to: '/client/dashboard' },
      { label: 'Create Task', to: '/client/create-task' },
      { label: 'My Tasks', to: '/client/tasks' },
      { label: 'Milestones', to: '/client/milestones' },
    ],
    FREELANCER: [
      { label: 'Dashboard', to: '/freelancer/dashboard' },
      { label: 'Profile', to: '/freelancer/profile' },
      { label: 'Tasks', to: '/freelancer/tasks' },
      { label: 'Milestones', to: '/freelancer/milestones' },
      { label: 'Performance', to: '/freelancer/performance' },
    ],
  };

  const links = navLinks[user.role] || [];

  return (
    <header className="nav-header">
      <div className="nav-container">
        <div className="nav-wrapper">
          <div className="nav-brand">
            <Link
              to={{ ADMIN: '/admin/dashboard', CLIENT: '/client/dashboard', FREELANCER: '/freelancer/dashboard' }[user.role] ?? '/'}
              className="nav-brand-link"
            >OutSource.</Link>
            <nav className="nav-items-wrapper">
              {links.map(link => (
                <NavLink key={link.to} to={link.to}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="nav-user-info">
            <div className="nav-user-details">
              <span className="nav-user-role">{user.role}</span>
              <span className="nav-user-email">{user.email}</span>
            </div>
            <div className="nav-user-avatar">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-neutral-500 hover:text-red-600 transition-colors bg-transparent border-none p-0 cursor-pointer ml-3"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
