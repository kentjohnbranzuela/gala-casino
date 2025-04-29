import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, CreditCard, History, Award, Tag, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import CustomerServiceForm from './CustomerServiceForm';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [promoCode, setPromoCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Get user's info from localStorage
    const getUserInfo = () => {
      try {
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const currentUser = users.find((user: any) => user.username === username);
          if (currentUser) {
            setUserBalance(currentUser.balance || 0);
            setPhoneNumber(currentUser.phoneNumber || '');
          }
        }
      } catch (error) {
        console.error("Error getting user info:", error);
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

    // Get public promo codes (codes that should be visible to users)
    const getPromoCodes = () => {
      try {
        const storedPublicPromoCodes = localStorage.getItem('publicPromoCodes');
        if (storedPublicPromoCodes) {
          const parsedPromoCodes = JSON.parse(storedPublicPromoCodes);
          setPromoCodes(parsedPromoCodes);
        } else {
          setPromoCodes([]);
        }
      } catch (error) {
        console.error("Error loading promo codes:", error);
        setPromoCodes([]);
      }
    };
    
    // Get user notifications
    const getUserNotifications = () => {
      try {
        const storedNotifications = localStorage.getItem('userNotifications');
        if (storedNotifications) {
          const allNotifications = JSON.parse(storedNotifications);
          const userNotifs = allNotifications[username] || [];
          setUserNotifications(userNotifs);
          
          // Check for new notifications
          const hasNew = userNotifs.some((notif: any) => !notif.read);
          setHasNewNotification(hasNew);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    getUserInfo();
    getWithdrawalHistory();
    getDepositHistory();
    getPromoCodes();
    getUserNotifications();

    // Set up event listener to reload data when localStorage changes
    const handleStorageChange = () => {
      getUserInfo();
      getWithdrawalHistory();
      getDepositHistory();
      getPromoCodes();
      getUserNotifications();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user:notification', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user:notification', handleStorageChange);
    };
  }, [username]);
  
  // Safely format amount with fallback
  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '₱0';
    return `₱${amount.toLocaleString()}`;
  };
  
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
          
          // Simulate SMS notification
          if (phoneNumber) {
            console.info(`SMS notification sent to ${phoneNumber}: Your account password has been updated successfully.`);
          }
          
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
        sessionStorage.setItem('username', newUsername);
        
        // Simulate SMS notification
        if (phoneNumber) {
          console.info(`SMS notification sent to ${phoneNumber}: Your username has been updated to ${newUsername}.`);
        }
        
        toast.success('Username updated successfully');
        window.location.reload(); // Reload to update header
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error('An error occurred while updating username');
    }
  };
  
  const handleRedeemPromoCode = () => {
    if (!promoCode) {
      toast.error('Please enter a promo code');
      return;
    }
    
    try {
      const storedUsers = localStorage.getItem('registeredUsers');
      const storedPromoCodes = localStorage.getItem('publicPromoCodes') || localStorage.getItem('promoCodes');
      
      if (storedUsers && storedPromoCodes) {
        const users = JSON.parse(storedUsers);
        const allPromoCodes = JSON.parse(storedPromoCodes);
        const currentUser = users.find((user: any) => user.username === username);
        const matchingPromo = allPromoCodes.find((promo: any) => 
          promo.code === promoCode.toUpperCase() && !promo.used
        );
        
        if (!matchingPromo) {
          toast.error('Invalid or already used promo code');
          return;
        }
        
        if (currentUser) {
          // Update user's balance with the bonus amount
          const updatedUsers = users.map((user: any) => {
            if (user.username === username) {
              return { 
                ...user, 
                balance: (user.balance || 0) + matchingPromo.bonus
              };
            }
            return user;
          });
          
          // Mark promo code as used
          const updatedPromoCodes = allPromoCodes.map((promo: any) => {
            if (promo.code === matchingPromo.code) {
              return {
                ...promo,
                used: true,
                usedBy: username
              };
            }
            return promo;
          });
          
          // Update localStorage
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          
          if (localStorage.getItem('publicPromoCodes')) {
            localStorage.setItem('publicPromoCodes', JSON.stringify(updatedPromoCodes));
          }
          if (localStorage.getItem('promoCodes')) {
            localStorage.setItem('promoCodes', JSON.stringify(updatedPromoCodes));
          }
          
          // Update state
          setUserBalance((prev) => prev + matchingPromo.bonus);
          setPromoCodes(updatedPromoCodes);
          setPromoCode('');
          
          // Simulate SMS notification
          if (phoneNumber) {
            console.info(`SMS notification sent to ${phoneNumber}: You have successfully redeemed promo code ${matchingPromo.code} for ${formatAmount(matchingPromo.bonus)}.`);
          }
          
          // Show success message
          toast.success(`Promo code redeemed successfully! ${formatAmount(matchingPromo.bonus)} added to your balance.`);
          
          // Trigger storage event
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (error) {
      console.error("Error redeeming promo code:", error);
      toast.error('An error occurred while redeeming the promo code');
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
            {phoneNumber && (
              <p className="text-sm text-gray-400">Phone: {phoneNumber}</p>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="text-2xl font-bold text-casino-gold">{formatAmount(userBalance)}</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="security" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-5'} mb-8`}>
          <TabsTrigger value="security" className="flex flex-col items-center justify-center gap-1 py-3">
            <Shield size={isMobile ? 16 : 20} />
            <span className="text-xs md:text-sm">Security</span>
          </TabsTrigger>
          <TabsTrigger value="deposits" className="flex flex-col items-center justify-center gap-1 py-3">
            <CreditCard size={isMobile ? 16 : 20} />
            <span className="text-xs md:text-sm">Deposits</span>
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="flex flex-col items-center justify-center gap-1 py-3">
            <History size={isMobile ? 16 : 20} />
            <span className="text-xs md:text-sm">Withdrawals</span>
          </TabsTrigger>
          {!isMobile && (
            <TabsTrigger value="promo" className="flex flex-col items-center justify-center gap-1 py-3">
              <Tag size={20} />
              <span className="text-sm">Promos</span>
            </TabsTrigger>
          )}
          {!isMobile && (
            <TabsTrigger value="support" className="flex flex-col items-center justify-center gap-1 py-3">
              <MessageSquare size={20} />
              <span className="text-sm">Support</span>
            </TabsTrigger>
          )}
        </TabsList>

        {isMobile && (
          <div className="flex space-x-2 mb-4">
            <TabsTrigger value="promo" className="flex-1 flex items-center justify-center gap-1 py-2">
              <Tag size={16} />
              <span className="text-xs">Promos</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex-1 flex items-center justify-center gap-1 py-2">
              <MessageSquare size={16} />
              <span className="text-xs">Support</span>
            </TabsTrigger>
          </div>
        )}
        
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
                          <td>{deposit.method || 'Unknown'}</td>
                          <td>{deposit.id || 'N/A'}</td>
                          <td>{formatAmount(deposit.amount)}</td>
                          <td>{deposit.requestDate ? new Date(deposit.requestDate).toLocaleString() : 'Unknown Date'}</td>
                          <td>
                            <span className={`status-badge ${
                              deposit.status === 'pending' ? 'status-processing' : 
                              deposit.status === 'approved' ? 'status-success' :
                              'status-failed'
                            }`}>
                              {(deposit.status || 'unknown').toUpperCase()}
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
                          <td>{withdrawal.method || 'Unknown'}</td>
                          <td>{withdrawal.id || 'N/A'}</td>
                          <td>{formatAmount(withdrawal.amount)}</td>
                          <td>{withdrawal.requestDate ? new Date(withdrawal.requestDate).toLocaleString() : 'Unknown Date'}</td>
                          <td>
                            <span className={`status-badge ${
                              withdrawal.status === 'processing' ? 'status-processing' : 
                              withdrawal.status === 'transferring' ? 'status-transferring' : 
                              withdrawal.status === 'success' ? 'status-success' :
                              'status-failed'
                            }`}>
                              {(withdrawal.status || 'unknown').toUpperCase()}
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
              <div className="flex space-x-2 mb-6">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-muted border-casino-purple-dark"
                />
                <Button onClick={handleRedeemPromoCode} className="btn-casino whitespace-nowrap">
                  Redeem
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Bonus</th>
                      <th>Expires</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoCodes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-400">
                          No promo codes available
                        </td>
                      </tr>
                    ) : (
                      promoCodes.map((promo) => (
                        <tr key={promo.id || promo.code}>
                          <td>{promo.code}</td>
                          <td>{formatAmount(promo.bonus)}</td>
                          <td>{promo.expiryDate || 'No expiry'}</td>
                          <td>
                            <span className={`status-badge ${promo.used ? 'status-success' : 'bg-amber-500'}`}>
                              {promo.used ? (promo.usedBy === username ? 'REDEEMED BY YOU' : 'USED') : 'AVAILABLE'}
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
        
        <TabsContent value="support">
          <CustomerServiceForm />
          
          {userNotifications && userNotifications.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Support Notifications</CardTitle>
                <CardDescription>Messages from customer support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg ${notification.read ? 'bg-muted' : 'bg-casino-purple/20 border-l-2 border-casino-gold'}`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{notification.message}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
