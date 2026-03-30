import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import '../Dashboard.css';
import './Admin.css';

const fmt = (ts) => { try { return new Date(ts).toLocaleString(); } catch { return ts || '—'; } };

const getPaymentStatusClass = (s) => ({
  COMPLETED: 'status-active',
  PENDING:   'status-pending',
  REFUNDED:  'status-submitted',
  FAILED:    'status-rejected',
})[s] || 'status-default';

export const PaymentManagementPage = () => {
  const [payments, setPayments]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => { fetchPayments(); }, [filterStatus]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = filterStatus
        ? await api.get(`/admin/payments/status/${filterStatus}`)
        : await api.get('/admin/payments');
      setPayments(res.data.paymentList || res.data);
    } catch { setError('Failed to fetch payments'); }
    setLoading(false);
  };

  const handleRefund = async (paymentId) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/payments/${paymentId}/refund`, reason);
      fetchPayments();
    } catch { setError('Failed to process refund'); }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) setSelectedPayment(null);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>Payment Management</h2>
            <p className="dashboard-header-text">Monitor transactions and process refunds.</p>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '12px', alignItems: 'flex-end',
          padding: '16px 20px', background: 'var(--white)',
          border: '2px solid var(--border)', borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--shadow-brut)',
        }}>
          <div className="dash-field" style={{ marginBottom: 0, minWidth: '200px' }}>
            <label className="dash-label">Filter by status</label>
            <select className="dash-select" value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All payments</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {loading ? <div className="dash-loading">Loading payments...</div>
          : error ? <div className="empty-state" style={{ color: 'var(--red)' }}>{error}</div>
          : payments.length === 0 ? <div className="empty-state">No payments found.</div>
          : (
          <div className="table-container">
            <table className="dash-table">
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
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: 'var(--ink-3)', fontSize: '12px' }}>
                      #{p.id}
                    </td>
                    <td><span className="payment-amount">${p.amount}</span></td>
                    <td>
                      <span className={`status-badge ${getPaymentStatusClass(p.status)}`}>{p.status}</span>
                    </td>
                    <td style={{ color: 'var(--ink-3)', fontSize: '13px' }}>{fmt(p.createdAt)}</td>
                    <td>
                      <div className="admin-user-actions">
                        {p.status === 'COMPLETED' && (
                          <button className="btn-suspend" onClick={() => handleRefund(p.id)}>
                            ↩ Refund
                          </button>
                        )}
                        <button className="freelancer-action-btn" onClick={() => setSelectedPayment(p)}>
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedPayment && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Payment #{selectedPayment.id}</div>
                <button className="modal-close" onClick={() => setSelectedPayment(null)}>✕</button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-detail-card" style={{ padding: '16px' }}>
                    <div className="freelancer-info-card-label">Amount</div>
                    <div className="freelancer-info-card-value" style={{ color: 'var(--accent-3)', marginTop: '4px' }}>
                      ${selectedPayment.amount}
                    </div>
                  </div>
                  <div className="admin-detail-card" style={{ padding: '16px' }}>
                    <div className="freelancer-info-card-label">Status</div>
                    <div style={{ marginTop: '8px' }}>
                      <span className={`status-badge ${getPaymentStatusClass(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: 'var(--paper)', border: '2px solid var(--border-light)', borderRadius: 'var(--r)' }}>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-3)', marginBottom: '4px' }}>
                    Created At
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 500 }}>{fmt(selectedPayment.createdAt)}</div>
                </div>
                {selectedPayment.status === 'COMPLETED' && (
                  <button className="btn-danger btn-full" onClick={() => { handleRefund(selectedPayment.id); setSelectedPayment(null); }}>
                    ↩ Process Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};