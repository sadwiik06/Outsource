import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';

export const FreelancerProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/freelancer/profile/${user.id}`);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
    }
    setLoading(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Profile</h2>
      {profile && (
        <div>
          <p>Email: {profile.email}</p>
          <p>Name: {profile.name}</p>
          <p>Skills: {profile.skills}</p>
          <p>Rating: {profile.rating}</p>
          <p>Status: {profile.status}</p>
        </div>
      )}
    </div>
  );
};
