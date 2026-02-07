import api from './api';

export const taskService = {
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  assignFreelancer: (taskId, freelancerId) =>
    api.put(`/tasks/${taskId}/assign/${freelancerId}`),
};

export const clientTaskService = {
  createTask: (task) => api.post('/client/tasks', task),
  assignFreelancer: (taskId, freelancerId) =>
    api.post(`/client/assign-freelancer/${taskId}/${freelancerId}`),
  getSuggestedMilestones: (taskId) =>
    api.get(`/client/milestones/suggest/${taskId}`),
  confirmMilestones: (taskId, milestoneIds) =>
    api.post(`/milestones/confirm/${taskId}`, { milestoneIds }),
  getMilestonesByTaskId: (taskId) =>
    api.get(`/milestones/task/${taskId}`),
  fundMilestone: (milestoneId) =>
    api.post(`/client/fund-milestone/${milestoneId}`),
  approveMilestone: (milestoneId, data) =>
    api.post(`/client/approve-milestone/${milestoneId}`, data),
  rejectMilestone: (milestoneId, reason) =>
    api.post(`/client/reject-milestone/${milestoneId}`, reason),
  getClientMilestones: (clientId) =>
    api.get(`/client/milestones/${clientId}`),
  getTasksByClientId: (clientId) =>
    api.get(`/tasks/client/${clientId}`),
  getFreelancersWithPerformance: () =>
    api.get('/client/freelancers'),
};
