
import React from 'react';
import Layout from '@/components/layout/Layout';
import WithdrawalApproval from '@/components/admin/WithdrawalApproval';

const AdminPage: React.FC = () => {
  return (
    <Layout>
      <WithdrawalApproval />
    </Layout>
  );
};

export default AdminPage;
