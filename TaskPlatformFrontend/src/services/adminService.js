import api from './api';

export const adminService = {
  // User Management
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  suspendUser: (userId, reason) => 
    api.post(`/admin/users/${userId}/suspend`, reason),
  activateUser: (userId) => 
    api.post(`/admin/users/${userId}/activate`),

  // Task Management
  getAllTasks: () => api.get('/admin/tasks'),
  getTasksByStatus: (status) => 
    api.get(`/admin/tasks/status/${status}`),
  cancelTask: (taskId, reason) => 
    api.post(`/admin/tasks/${taskId}/cancel`, reason),

  // Payment Management
  getAllPayments: () => api.get('/admin/payments'),
  getPaymentsByStatus: (status) => 
    api.get(`/admin/payments/status/${status}`),
  refundPayment: (paymentId, reason) => 
    api.post(`/admin/payments/${paymentId}/refund`, reason),

  // Performance Analytics
  getAllPerformance: () => api.get('/admin/performance/all'),
  getTopPerformers: (limit) => 
    api.get(`/admin/performance/top/${limit}`),
  getRiskUsers: () => api.get('/admin/performance/risk'),

  // System Analytics
  getDashboard: () => api.get('/admin/analytics/dashboard'),

  // Audit Logs
  getAllAuditLogs: () => api.get('/admin/audits'),
  getAuditLogsByUser: (userId) => 
    api.get(`/admin/audits/user/${userId}`),
  getAuditLogsByAction: (action) => 
    api.get(`/admin/audits/action/${action}`),
};
