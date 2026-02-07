import React, { useState, useEffect } from 'react';
import api from '../../config/api';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleSuspend = async (userId) => {
    const reason = prompt('Enter suspension reason:');
    if (reason) {
      try {
        await api.post(`/admin/users/${userId}/suspend`, reason);
        fetchUsers();
      } catch (err) {
        setError('Failed to suspend user');
      }
    }
  };

  const handleActivate = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/activate`);
      fetchUsers();
    } catch (err) {
      setError('Failed to activate user');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                {user.status === 'SUSPENDED' ? (
                  <button onClick={() => handleActivate(user.id)}>Activate</button>
                ) : (
                  <button onClick={() => handleSuspend(user.id)}>Suspend</button>
                )}
                <button onClick={() => setSelectedUser(user)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div>
          <h3>User Details</h3>
          <p>ID: {selectedUser.id}</p>
          <p>Email: {selectedUser.email}</p>
          <p>Role: {selectedUser.role}</p>
          <p>Status: {selectedUser.status}</p>
          <button onClick={() => setSelectedUser(null)}>Close</button>
        </div>
      )}
    </div>
  );
};
