
import React from 'react';
import Layout from '@/components/layout/Layout';
import WithdrawalApproval from '@/components/admin/WithdrawalApproval';
import UserManagement from '@/components/admin/UserManagement';
import AuthProtection from '@/components/auth/AuthProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage: React.FC = () => {
  return (
    <AuthProtection requiredRole="admin" excludeRole="user">
      <Layout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-casino-gold">Admin Panel</h1>
          
          <Tabs defaultValue="withdrawals" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="withdrawals">Withdrawal Approvals</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="withdrawals">
              <WithdrawalApproval />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </AuthProtection>
  );
};

export default AdminPage;
