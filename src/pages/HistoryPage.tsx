
import React from 'react';
import Layout from '@/components/layout/Layout';
import HistoryTabs from '@/components/history/HistoryTabs';

const HistoryPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <HistoryTabs />
      </div>
    </Layout>
  );
};

export default HistoryPage;
