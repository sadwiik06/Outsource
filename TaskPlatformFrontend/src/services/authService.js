import api from './api';

export const authService = {
  register: (email, password, role) => {
    return api.post('/auth/register', { email, password, role });
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
