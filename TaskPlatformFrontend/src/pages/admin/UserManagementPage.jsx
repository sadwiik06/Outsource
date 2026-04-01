import React, { useState, useEffect, useContext } from 'react';
import api from '../../config/api';
import { AuthContext } from '../../context/AuthContext';
import '../Dashboard.css';
import './Admin.css';

const getRoleClass = (role) => ({
  ADMIN:      'role-admin',
  CLIENT:     'role-client',
  FREELANCER: 'role-freelancer',
})[role] || 'status-default';

const getUserStatusClass = (s) => ({
  ACTIVE:    'status-active',
  SUSPENDED: 'status-suspended',
  CLOSED:    'status-suspended',
  OPEN:      'status-default',
  INACTIVE:  'status-default',
})[s] || 'status-default';

export const UserManagementPage = () => {
  const { user: currentUser }               = useContext(AuthContext);
  const [users, setUsers]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [selectedUser, setSelectedUser]     = useState(null);
  const [search, setSearch]                 = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch { setError('Failed to fetch users'); }
    setLoading(false);
  };

  const handleSuspend = async (userId) => {
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;
    try {
      await api.post(`/admin/users/${userId}/suspend`, reason);
      fetchUsers();
    } catch { setError('Failed to suspend user'); }
  };

  const handleActivate = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/activate`);
      fetchUsers();
    } catch { setError('Failed to activate user'); }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) setSelectedUser(null);
  };

  const filtered = users.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) || String(u.id).includes(search)
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div className="dashboard-header-title">
            <h2>User Management</h2>
            <p className="dashboard-header-text">View, activate, and suspend platform accounts.</p>
          </div>
         
          {!loading && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total',     val: users.length,                              clr: 'var(--ink)' },
                { label: 'Active',    val: users.filter(u => u.status === 'ACTIVE').length,    clr: 'var(--accent-3)' },
                { label: 'Suspended', val: users.filter(u => u.status === 'SUSPENDED').length, clr: 'var(--red)' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '8px 16px',
                  background: 'var(--white)', border: '2px solid var(--border)',
                  borderRadius: 'var(--r)', boxShadow: 'var(--shadow-brut)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                }}>
                  <span style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '20px', color: s.clr, letterSpacing: '-1px', lineHeight: 1 }}>
                    {s.val}
                  </span>
                  <span style={{ fontFamily: 'var(--font-d)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--ink-3)' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div style={{
          padding: '14px 18px',
          background: 'var(--white)', border: '2px solid var(--border)',
          borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-brut)',
        }}>
          <div className="dash-field" style={{ marginBottom: 0 }}>
            <label className="dash-label">Search users</label>
            <input type="text" className="dash-input"
              placeholder="Search by email or ID…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? <div className="dash-loading">Loading users...</div>
          : error ? <div className="empty-state" style={{ color: 'var(--red)' }}>{error}</div>
          : filtered.length === 0 ? <div className="empty-state">No users found.</div>
          : (
          <div className="table-container">
            <table className="dash-table">
              <thead>
                <tr><th>ID</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: 'var(--ink-3)', fontSize: '12px' }}>
                      #{u.id}
                    </td>
                    <td style={{ fontWeight: 500 }}>{u.email}</td>
                    <td><span className={`role-tag ${getRoleClass(u.role)}`}>{u.role}</span></td>
                    <td>
                      <span className={`status-badge ${getUserStatusClass(u.status)}`}>{u.status}</span>
                    </td>
                    <td>
                      <div className="admin-user-actions">
                        {u.id !== currentUser?.id && (
                          (u.status === 'SUSPENDED' || u.status === 'CLOSED') ? (
                            <button className="btn-activate" onClick={() => handleActivate(u.id)}>
                              ✓ Activate
                            </button>
                          ) : (
                            <button className="btn-suspend" onClick={() => handleSuspend(u.id)}>
                              ⊘ Suspend
                            </button>
                          )
                        )}
                        <button className="freelancer-action-btn" onClick={() => setSelectedUser(u)}>
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

        
        {selectedUser && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <div className="modal-title">{selectedUser.email}</div>
                  <div style={{ marginTop: '5px', display: 'flex', gap: '8px' }}>
                    <span className={`role-tag ${getRoleClass(selectedUser.role)}`}>{selectedUser.role}</span>
                    <span className={`status-badge ${getUserStatusClass(selectedUser.status)}`}>{selectedUser.status}</span>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setSelectedUser(null)}>✕</button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '13px 16px', background: 'var(--paper)', border: '2px solid var(--border-light)', borderRadius: 'var(--r)' }}>
                  <div style={{ fontFamily: 'var(--font-d)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ink-3)', marginBottom: '4px' }}>
                    User ID
                  </div>
                  <div style={{ fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: '22px', letterSpacing: '-1px', color: 'var(--ink)' }}>
                    #{selectedUser.id}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {selectedUser.id !== currentUser?.id && (
                    (selectedUser.status === 'SUSPENDED' || selectedUser.status === 'CLOSED') ? (
                      <button className="btn-activate btn-full"
                        onClick={() => { handleActivate(selectedUser.id); setSelectedUser(null); }}>
                        ✓ Activate Account
                      </button>
                    ) : (
                      <button className="btn-danger btn-full"
                        onClick={() => { handleSuspend(selectedUser.id); setSelectedUser(null); }}>
                        ⊘ Suspend Account
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};