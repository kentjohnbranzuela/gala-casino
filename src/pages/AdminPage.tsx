
import React, { useEffect, useState } from 'react';
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
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const defaultTab = tabParam === 'support' ? 'support' : (
    tabParam === 'users' ? 'users' : 'deposits'
  );
  
  const [previousUsers, setPreviousUsers] = useState<string[]>([]);
  const [previousDeposits, setPreviousDeposits] = useState<number>(0);

  // Monitor for new users and deposits
  useEffect(() => {
    // Initialize counters
    try {
      const storedUsers = localStorage.getItem('registeredUsers');
      const storedDeposits = localStorage.getItem('depositRequests');
      
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        setPreviousUsers(users.map((user: any) => user.username));
      }
      
      if (storedDeposits) {
        const deposits = JSON.parse(storedDeposits);
        setPreviousDeposits(deposits.length);
      }
    } catch (error) {
      console.error("Error initializing monitoring:", error);
    }
    
    // Check for changes periodically
    const interval = setInterval(() => {
      try {
        // Check for new users
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const currentUsers = JSON.parse(storedUsers);
          const currentUsernames = currentUsers.map((user: any) => user.username);
          
          // Find new users
          const newUsers = currentUsernames.filter((username: string) => 
            !previousUsers.includes(username)
          );
          
          if (newUsers.length > 0) {
            newUsers.forEach((username: string) => {
              toast.info(`New user registered: ${username}`);
            });
            setPreviousUsers(currentUsernames);
          }
        }
        
        // Check for new deposits
        const storedDeposits = localStorage.getItem('depositRequests');
        if (storedDeposits) {
          const currentDeposits = JSON.parse(storedDeposits);
          
          if (currentDeposits.length > previousDeposits) {
            const newCount = currentDeposits.length - previousDeposits;
            toast.info(`${newCount} new deposit request(s) received`);
            setPreviousDeposits(currentDeposits.length);
          }
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [previousUsers, previousDeposits]);

  // Listen for storage events from other browser instances
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'registeredUsers' || e.key === 'depositRequests') {
        // Force refresh to update data
        window.location.reload();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
