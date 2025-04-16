import React, { useEffect, useState } from 'react';
import axios from '../../utils/api'; // Assuming you have a utility to handle axios requests
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout'); 
      Cookies.remove('refreshToken'); 
      router.push('/login'); 
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('/auth/profile'); 
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    router.push('/user/edit');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>User Profile</h2>
      {user ? (
        <div className="profile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleEdit}>Edit Profile</button>
          <button variant="danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default UserProfile;
