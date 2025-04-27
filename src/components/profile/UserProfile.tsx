
import React, { useState, useEffect } from 'react';
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
  const [userBalance, setUserBalance] = useState(0);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);

  useEffect(() => {
    // Get user's balance from localStorage
    const getUserBalance = () => {
      try {
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const currentUser = users.find((user: any) => user.username === username);
          if (currentUser) {
            setUserBalance(currentUser.balance || 0);
          }
        }
      } catch (error) {
        console.error("Error getting user balance:", error);
      }
    };

    // Get withdrawal history
    const getWithdrawalHistory = () => {
      try {
        const storedWithdrawals = localStorage.getItem('withdrawalRequests');
        if (storedWithdrawals) {
          const allWithdrawals = JSON.parse(storedWithdrawals);
          const userWithdrawals = allWithdrawals.filter((withdrawal: any) => 
            withdrawal.user === username
          );
          setWithdrawalHistory(userWithdrawals);
        } else {
          setWithdrawalHistory([]);
        }
      } catch (error) {
        console.error("Error loading withdrawals:", error);
        setWithdrawalHistory([]);
      }
    };

    // Get deposit history
    const getDepositHistory = () => {
      try {
        const storedDeposits = localStorage.getItem('depositRequests');
        if (storedDeposits) {
          const allDeposits = JSON.parse(storedDeposits);
          const userDeposits = allDeposits.filter((deposit: any) => 
            deposit.user === username
          );
          setDepositHistory(userDeposits);
        } else {
          setDepositHistory([]);
        }
      } catch (error) {
        console.error("Error loading deposits:", error);
        setDepositHistory([]);
      }
    };

    // Get promo codes
    const getPromoCodes = () => {
      try {
        const storedPromoCodes = localStorage.getItem('promoCodes');
        if (storedPromoCodes) {
          const parsedPromoCodes = JSON.parse(storedPromoCodes);
          setPromoCodes(parsedPromoCodes);
        } else {
          setPromoCodes([]);
        }
      } catch (error) {
        console.error("Error loading promo codes:", error);
        setPromoCodes([]);
      }
    };

    getUserBalance();
    getWithdrawalHistory();
    getDepositHistory();
    getPromoCodes();

    // Set up event listener to reload data when localStorage changes
    const handleStorageChange = () => {
      getUserBalance();
      getWithdrawalHistory();
      getDepositHistory();
      getPromoCodes();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [username]);
  
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
    const storedPromoCodes = localStorage.getItem('promoCodes');
    
    if (storedUsers && storedPromoCodes) {
      const users = JSON.parse(storedUsers);
      const promoCodes = JSON.parse(storedPromoCodes);
      const currentUser = users.find((user: any) => user.username === username);
      const promoCode = promoCodes.find((promo: any) => promo.code === code);
      
      if (currentUser && promoCode && !promoCode.used) {
        // Update user's balance
        const updatedUsers = users.map((user: any) => {
          if (user.username === username) {
            return { 
              ...user, 
              balance: (user.balance || 0) + promoCode.amount 
            };
          }
          return user;
        });
        
        // Mark promo code as used
        const updatedPromoCodes = promoCodes.map((promo: any) => 
          promo.code === code ? { ...promo, used: true, redeemedBy: username } : promo
        );
        
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        localStorage.setItem('promoCodes', JSON.stringify(updatedPromoCodes));
        
        toast.success(`Promo code ${code} redeemed! ₱${promoCode.amount} added to your balance.`);
        
        // Update UI
        setPromoCodes(updatedPromoCodes);
        setUserBalance((prev) => prev + promoCode.amount);
        
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'));
      } else if (promoCode && promoCode.used) {
        toast.error('This promo code has already been used');
      } else {
        toast.error('Invalid promo code');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-casino-gold">User Profile</h1>
      
      <div className="mb-6 p-4 bg-card rounded-lg border border-casino-purple-dark">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Welcome, {username}</h2>
            <p className="text-sm text-gray-400">Account Level: Regular</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="text-2xl font-bold text-casino-gold">₱{userBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
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
                      <th>Reference</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-400">
                          No deposit history found
                        </td>
                      </tr>
                    ) : (
                      depositHistory.map((deposit) => (
                        <tr key={deposit.id}>
                          <td>{deposit.method}</td>
                          <td>{deposit.id}</td>
                          <td>₱{deposit.amount.toLocaleString()}</td>
                          <td>{new Date(deposit.requestDate).toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${
                              deposit.status === 'pending' ? 'status-processing' : 
                              deposit.status === 'approved' ? 'status-success' :
                              'status-failed'
                            }`}>
                              {deposit.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
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
                      <th>Reference</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-400">
                          No withdrawal history found
                        </td>
                      </tr>
                    ) : (
                      withdrawalHistory.map((withdrawal) => (
                        <tr key={withdrawal.id}>
                          <td>{withdrawal.method}</td>
                          <td>{withdrawal.id}</td>
                          <td>₱{withdrawal.amount.toLocaleString()}</td>
                          <td>{new Date(withdrawal.requestDate).toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${
                              withdrawal.status === 'processing' ? 'status-processing' : 
                              withdrawal.status === 'transferring' ? 'status-transferring' : 
                              withdrawal.status === 'success' ? 'status-success' :
                              'status-failed'
                            }`}>
                              {withdrawal.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
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
                    {promoCodes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-400">
                          No promo codes available
                        </td>
                      </tr>
                    ) : (
                      promoCodes.map((promo) => (
                        <tr key={promo.code}>
                          <td>{promo.code}</td>
                          <td>₱{promo.amount.toLocaleString()}</td>
                          <td>{promo.expiryDate}</td>
                          <td>{promo.used ? 'Used' : 'Available'}</td>
                          <td>
                            {!promo.used ? (
                              <Button 
                                size="sm" 
                                className="btn-casino"
                                onClick={() => redeemPromoCode(promo.code)}
                              >
                                Redeem
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">Already redeemed</span>
                            )}
                          </td>
                        </tr>
                      ))
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
