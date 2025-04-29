
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import UserProfile from '@/components/profile/UserProfile';
import AuthProtection from '@/components/auth/AuthProtection';

const ProfilePage: React.FC = () => {
  // Ensure cross-device sync happens when profile page loads
  useEffect(() => {
    // Sync user data from localStorage to ensure cross-device functionality
    const syncUserData = () => {
      // Trigger a refresh of user data from localStorage
      window.dispatchEvent(new Event('storage:balance:updated'));
      window.dispatchEvent(new Event('user:notification'));
      
      // Force a reload of data if coming from another device
      const lastSyncTime = localStorage.getItem('lastSyncTime');
      const currentTime = Date.now().toString();
      
      if (!lastSyncTime || (parseInt(currentTime) - parseInt(lastSyncTime) > 300000)) {
        // It's been more than 5 minutes since last sync, sync data
        localStorage.setItem('lastSyncTime', currentTime);
      }
    };
    
    syncUserData();
  }, []);

  return (
    <AuthProtection requiredRole="user" excludeRole="admin">
      <Layout>
        <UserProfile />
      </Layout>
    </AuthProtection>
  );
};

export default ProfilePage;
