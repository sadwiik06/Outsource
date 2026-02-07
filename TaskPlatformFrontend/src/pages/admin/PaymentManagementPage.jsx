import React, { useState, useEffect } from 'react';
import api from '../../config/api';

export const PaymentManagementPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const fetchPayments = async () => {
    try {
      let response;
      if (filterStatus) {
        response = await api.get(`/admin/payments/status/${filterStatus}`);
      } else {
        response = await api.get('/admin/payments');
      }
      setPayments(response.data.paymentList || response.data);
    } catch (err) {
      setError('Failed to fetch payments');
    }
    setLoading(false);
  };

  const handleRefund = async (paymentId) => {
    const reason = prompt('Enter refund reason:');
    if (reason) {
      try {
        await api.post(`/admin/payments/${paymentId}/refund`, reason);
        fetchPayments();
      } catch (err) {
        setError('Failed to refund payment');
      }
    }
  };

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Payment Management</h2>
      <div>
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>${payment.amount}</td>
              <td>{payment.status}</td>
              <td>{payment.createdAt}</td>
              <td>
                {payment.status === 'COMPLETED' && (
                  <button onClick={() => handleRefund(payment.id)}>Refund</button>
                )}
                <button onClick={() => setSelectedPayment(payment)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPayment && (
        <div>
          <h3>Payment Details</h3>
          <p>Amount: ${selectedPayment.amount}</p>
          <p>Status: {selectedPayment.status}</p>
          <p>Created: {selectedPayment.createdAt}</p>
          <button onClick={() => setSelectedPayment(null)}>Close</button>
        </div>
      )}
    </div>
  );
};
