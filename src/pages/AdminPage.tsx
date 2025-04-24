
import React from 'react';
import Layout from '@/components/layout/Layout';
import WithdrawalApproval from '@/components/admin/WithdrawalApproval';
import AuthProtection from '@/components/auth/AuthProtection';

const AdminPage: React.FC = () => {
  return (
    <AuthProtection requiredRole="admin">
      <Layout>
        <WithdrawalApproval />
      </Layout>
    </AuthProtection>
  );
};

export default AdminPage;
