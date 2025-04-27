
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, CreditCard, History, Award, Tag } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile: React.FC = () => {
  const username = localStorage.getItem('username') || '';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  
  // Mock deposit history - in a real app, this would come from a database
  const depositHistory = [
    { id: '1', method: 'GCash', amount: 1000, date: '2025-04-24', status: 'completed' },
    { id: '2', method: 'Bank Transfer', amount: 5000, date: '2025-04-22', status: 'completed' },
  ];
  
  // Mock withdrawal history - would be fetched from storage
  const withdrawalHistory = [
    { id: '1', method: 'GCash', amount: 2000, date: '2025-04-24', status: 'processing' },
    { id: '2', method: 'Bank Transfer', amount: 3000, date: '2025-04-21', status: 'transferring' },
    { id: '3', method: 'GCash', amount: 1500, date: '2025-04-20', status: 'success' },
  ];
  
  // Mock promo codes - would be fetched from storage
  const promoCodes = [
    { code: 'WELCOME100', bonus: 100, expiryDate: '2025-05-30', used: false },
  ];
  
  const handleUpdatePassword = () => {
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const currentUser = users.find((user: any) => user.username === username);
        
        if (currentUser && currentUser.password === currentPassword) {
          // Update password
          const updatedUsers = users.map((user: any) => {
            if (user.username === username) {
              return { ...user, password: newPassword };
            }
            return user;
          });
          
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          toast.success('Password updated successfully');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          toast.error('Current password is incorrect');
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error('An error occurred while updating password');
    }
  };
  
  const handleUpdateUsername = () => {
    if (!newUsername) {
      toast.error('Please enter a new username');
      return;
    }
    
    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        
        // Check if username already exists
        if (users.some((user: any) => user.username === newUsername)) {
          toast.error('Username already exists');
          return;
        }
        
        const updatedUsers = users.map((user: any) => {
          if (user.username === username) {
            return { ...user, username: newUsername };
          }
          return user;
        });
        
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        localStorage.setItem('username', newUsername);
        toast.success('Username updated successfully');
        window.location.reload(); // Reload to update header
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error('An error occurred while updating username');
    }
  };
  
  const redeemPromoCode = (code: string) => {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const currentUser = users.find((user: any) => user.username === username);
      
      if (currentUser) {
        toast.success(`Promo code ${code} redeemed!`);
        
        // Mark code as used - in real app this would update the database
        const updatedPromoCodes = promoCodes.map(promo => 
          promo.code === code ? { ...promo, used: true } : promo
        );
        
        // In real app, would update user's balance in database
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-casino-gold">User Profile</h1>
      
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="security" className="flex flex-col items-center justify-center gap-2 py-4">
            <Shield size={20} />
            <span>Account Security</span>
          </TabsTrigger>
          <TabsTrigger value="deposits" className="flex flex-col items-center justify-center gap-2 py-4">
            <CreditCard size={20} />
            <span>Deposit History</span>
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="flex flex-col items-center justify-center gap-2 py-4">
            <History size={20} />
            <span>Withdrawal Status</span>
          </TabsTrigger>
          <TabsTrigger value="promo" className="flex flex-col items-center justify-center gap-2 py-4">
            <Tag size={20} />
            <span>Promo Codes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-muted border-casino-purple-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-muted border-casino-purple-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-muted border-casino-purple-dark"
                    />
                  </div>
                  <Button 
                    onClick={handleUpdatePassword} 
                    className="btn-gold w-full mt-4"
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Update Username</CardTitle>
                <CardDescription>Change your username</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Username</label>
                    <Input 
                      value={username}
                      disabled
                      className="bg-muted border-casino-purple-dark opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Username</label>
                    <Input 
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-muted border-casino-purple-dark"
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateUsername} 
                    className="btn-gold w-full mt-4"
                  >
                    Update Username
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="deposits">
          <Card>
            <CardHeader>
              <CardTitle>Deposit History</CardTitle>
              <CardDescription>View all your deposit transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositHistory.map((deposit) => (
                      <tr key={deposit.id}>
                        <td>{deposit.method}</td>
                        <td>₱{deposit.amount.toLocaleString()}</td>
                        <td>{deposit.date}</td>
                        <td>
                          <span className="status-badge status-success">
                            COMPLETED
                          </span>
                        </td>
                      </tr>
                    ))}
                    {depositHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No deposit history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Status</CardTitle>
              <CardDescription>Track your withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalHistory.map((withdrawal) => (
                      <tr key={withdrawal.id}>
                        <td>{withdrawal.method}</td>
                        <td>₱{withdrawal.amount.toLocaleString()}</td>
                        <td>{withdrawal.date}</td>
                        <td>
                          <span className={`status-badge ${
                            withdrawal.status === 'processing' ? 'status-processing' : 
                            withdrawal.status === 'transferring' ? 'status-transferring' : 
                            'status-success'
                          }`}>
                            {withdrawal.status === 'processing' ? 'PROCESSING' : 
                             withdrawal.status === 'transferring' ? 'TRANSFERRING' : 
                             'SUCCESS'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {withdrawalHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          No withdrawal history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promo">
          <Card>
            <CardHeader>
              <CardTitle>Promo Codes</CardTitle>
              <CardDescription>Redeem promotional offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Bonus</th>
                      <th>Expires</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes.map((promo) => (
                      <tr key={promo.code}>
                        <td>{promo.code}</td>
                        <td>₱{promo.bonus.toLocaleString()}</td>
                        <td>{promo.expiryDate}</td>
                        <td>{promo.used ? 'Used' : 'Available'}</td>
                        <td>
                          {!promo.used && (
                            <Button 
                              size="sm" 
                              className="btn-casino"
                              onClick={() => redeemPromoCode(promo.code)}
                            >
                              Redeem
                            </Button>
                          )}
                          {promo.used && (
                            <span className="text-sm text-muted-foreground">Already redeemed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {promoCodes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          No promo codes available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
