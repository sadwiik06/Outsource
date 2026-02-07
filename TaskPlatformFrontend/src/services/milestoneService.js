import api from './api';

export const milestoneService = {
  suggestMilestones: (taskId) => 
    api.get(`/milestones/suggest/${taskId}`),
  confirmMilestones: (taskId, milestoneIds) => 
    api.post(`/milestones/confirm/${taskId}`, { milestoneIds }),
  submitMilestone: (milestoneId, submissionUrl) => 
    api.post(`/milestones/submit/${milestoneId}`, submissionUrl),
  approveMilestone: (milestoneId) => 
    api.post(`/milestones/approve/${milestoneId}`),
};
