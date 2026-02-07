import api from './api';

export const freelancerService = {
  getProfile: (freelancerId) => 
    api.get(`/freelancer/profile/${freelancerId}`),
  getAssignedTasks: (freelancerId) => 
    api.get(`/freelancer/tasks/${freelancerId}`),
  getMilestones: (freelancerId) => 
    api.get(`/freelancer/milestones/${freelancerId}`),
  getPerformance: (freelancerId) => 
    api.get(`/freelancer/performance/${freelancerId}`),
  submitMilestone: (milestoneId, submissionUrl, freelancerId) => 
    api.post(`/freelancer/submit-milestone/${milestoneId}`, submissionUrl, {
      headers: { 'X-User-Id': freelancerId },
    }),
  getPendingMilestones: (freelancerId) => 
    api.get(`/freelancer/pending-milestones/${freelancerId}`),
  getTaskDetails: (taskId) => 
    api.get(`/freelancer/task/${taskId}`),
  getCompletedTasks: (freelancerId) => 
    api.get(`/freelancer/completed-tasks/${freelancerId}`),
  getStats: (freelancerId) => 
    api.get(`/freelancer/stats/${freelancerId}`),
};
