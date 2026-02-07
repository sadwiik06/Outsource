import api from './api';

export const paymentService = {
  holdFunds: (milestoneId) => 
    api.post(`/payments/hold/${milestoneId}`),
  releasePayment: (milestoneId) => 
    api.post(`/payments/release/${milestoneId}`),
  refundPayment: (milestoneId) => 
    api.post(`/payments/refund/${milestoneId}`),
};
