import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div>
      <h1>Welcome to TaskPlatform</h1>
      <p>A comprehensive platform connecting clients with talented freelancers</p>
      
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>

      <div>
        <h2>Features</h2>
        <ul>
          <li>Post and manage tasks</li>
          <li>Find qualified freelancers</li>
          <li>Secure payment processing</li>
          <li>Milestone-based delivery</li>
          <li>Performance tracking</li>
        </ul>
      </div>
    </div>
  );
};
