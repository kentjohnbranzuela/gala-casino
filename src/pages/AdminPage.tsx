
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import WithdrawalApproval from '@/components/admin/WithdrawalApproval';
import DepositApproval from '@/components/admin/DepositApproval';
import UserManagement from '@/components/admin/UserManagement';
import PromoCodeManagement from '@/components/admin/PromoCodeManagement';
import PromoCodePublicList from '@/components/admin/PromoCodePublicList';
import CustomerSupportManagement from '@/components/admin/CustomerSupportManagement';
import AuthProtection from '@/components/auth/AuthProtection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam === 'support' ? 'support' : (
    tabParam === 'users' ? 'users' : 'deposits'
  );

  return (
    <AuthProtection requiredRole="admin" excludeRole="user">
      <Layout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-casino-gold">Admin Panel</h1>
          
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="deposits">Deposit Approvals</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawal Approvals</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="promo">Promo Codes</TabsTrigger>
              <TabsTrigger value="support">Customer Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deposits">
              <DepositApproval />
            </TabsContent>
            
            <TabsContent value="withdrawals">
              <WithdrawalApproval />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="promo">
              <PromoCodeManagement />
              <PromoCodePublicList />
            </TabsContent>
            
            <TabsContent value="support">
              <CustomerSupportManagement />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </AuthProtection>
  );
};

export default AdminPage;
