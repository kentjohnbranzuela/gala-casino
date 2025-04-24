
import React from 'react';
import Layout from '@/components/layout/Layout';
import HistoryTabs from '@/components/history/HistoryTabs';
import AuthProtection from '@/components/auth/AuthProtection';

const HistoryPage: React.FC = () => {
  return (
    <AuthProtection>
      <Layout>
        <div className="max-w-5xl mx-auto">
          <HistoryTabs />
        </div>
      </Layout>
    </AuthProtection>
  );
};

export default HistoryPage;
