
import React from 'react';
import Layout from '@/components/layout/Layout';
import WithdrawalApproval from '@/components/admin/WithdrawalApproval';
import AuthProtection from '@/components/auth/AuthProtection';

const AdminPage: React.FC = () => {
  return (
    <AuthProtection requiredRole="admin" excludeRole="user">
      <Layout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-casino-gold">Admin Panel</h1>
          <WithdrawalApproval />
        </div>
      </Layout>
    </AuthProtection>
  );
};

export default AdminPage;
