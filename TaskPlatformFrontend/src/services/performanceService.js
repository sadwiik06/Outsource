import api from './api';

export const performanceService = {
  getFreelancerPerformance: (freelancerId) => 
    api.get(`/performance/freelancer/${freelancerId}`),
  getClientPerformance: (clientId) => 
    api.get(`/performance/client/${clientId}`),
  updateScoreAfterApproval: (milestoneId) => 
    api.post(`/performance/update-score/approve/${milestoneId}`),
  updateScoreAfterRejection: (milestoneId) => 
    api.post(`/performance/update-score/reject/${milestoneId}`),
};
