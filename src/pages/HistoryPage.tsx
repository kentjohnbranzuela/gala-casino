
import React from 'react';
import Layout from '@/components/layout/Layout';
import HistoryTabs from '@/components/history/HistoryTabs';
import AuthProtection from '@/components/auth/AuthProtection';

const HistoryPage: React.FC = () => {
  return (
    <AuthProtection requiredRole="user" excludeRole="admin">
      <Layout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-casino-gold">Transaction History</h1>
          <HistoryTabs />
        </div>
      </Layout>
    </AuthProtection>
  );
};

export default HistoryPage;
