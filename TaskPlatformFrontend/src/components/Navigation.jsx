import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    );
  }

  const navLinks = {
    ADMIN: [
      { label: 'Dashboard', to: '/admin/dashboard' },
      { label: 'Users', to: '/admin/users' },
      { label: 'Tasks', to: '/admin/tasks' },
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
    <nav>
      <div>
        <h3>TaskPlatform</h3>
      </div>
      <div>
        {links.map(link => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
      <div>
        <p>{user.email} ({user.role})</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};
