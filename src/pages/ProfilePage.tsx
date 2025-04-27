
import React from 'react';
import Layout from '@/components/layout/Layout';
import UserProfile from '@/components/profile/UserProfile';
import AuthProtection from '@/components/auth/AuthProtection';

const ProfilePage: React.FC = () => {
  return (
    <AuthProtection requiredRole="user" excludeRole="admin">
      <Layout>
        <UserProfile />
      </Layout>
    </AuthProtection>
  );
};

export default ProfilePage;
