
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface Deposit {
  id: string;
  user: string;
  method: string;
  accountNumber: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const DepositApproval: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  
  useEffect(() => {
    // Load deposit requests from localStorage
    const loadDeposits = () => {
      try {
        const storedDeposits = localStorage.getItem('depositRequests');
        if (storedDeposits) {
          const parsedDeposits = JSON.parse(storedDeposits);
          setDeposits(parsedDeposits);
        } else {
          localStorage.setItem('depositRequests', JSON.stringify([]));
          setDeposits([]);
        }
      } catch (error) {
        console.error("Error loading deposits:", error);
        setDeposits([]);
      }
    };
    
    loadDeposits();
    
    // Set up event listener to reload deposits when localStorage changes
    const handleStorageChange = () => {
      loadDeposits();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    const updatedDeposits = deposits.map(deposit => {
      if (deposit.id === id) {
        return { ...deposit, status: newStatus };
      }
      return deposit;
    });
    
    setDeposits(updatedDeposits);
    localStorage.setItem('depositRequests', JSON.stringify(updatedDeposits));
    
    // Show success message
    if (newStatus === 'approved') {
      // Update user's balance when deposit is approved
      try {
        const deposit = deposits.find(d => d.id === id);
        if (deposit) {
          const storedUsers = localStorage.getItem('registeredUsers');
          if (storedUsers) {
            const users = JSON.parse(storedUsers);
            const updatedUsers = users.map((user: any) => {
              if (user.username === deposit.user) {
                const currentBalance = user.balance || 0;
                return { 
                  ...user, 
                  balance: currentBalance + deposit.amount,
                  depositCount: (user.depositCount || 0) + 1,
                  totalDeposits: (user.totalDeposits || 0) + deposit.amount
                };
              }
              return user;
            });
            localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          }
          
          // Send SMS notification (simulation)
          console.log(`SMS notification sent to ${deposit.accountNumber}: Your deposit of ₱${deposit.amount} has been approved!`);
          toast.success(`Deposit of ₱${deposit.amount} approved and balance updated. SMS notification sent.`);
        }
      } catch (error) {
        console.error("Error updating user balance:", error);
        toast.error("Error updating user balance");
      }
    } else {
      toast.error('Deposit rejected');
    }
    
    // Trigger event to update user's deposit history
    window.dispatchEvent(new Event('storage'));
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Deposit Approvals</h1>
      
      <div className="bg-card border border-casino-purple-dark rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="history-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Method</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">
                    No deposit requests found
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td>{deposit.user}</td>
                    <td>{deposit.method}</td>
                    <td>{deposit.accountNumber}</td>
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
                    <td>
                      <div className="flex gap-2">
                        {deposit.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleUpdateStatus(deposit.id, 'approved')}
                            >
                              <Check className="mr-1 h-4 w-4" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleUpdateStatus(deposit.id, 'rejected')}
                            >
                              <X className="mr-1 h-4 w-4" /> Reject
                            </Button>
                          </>
                        )}
                        
                        {(deposit.status === 'approved' || deposit.status === 'rejected') && (
                          <span className="text-sm text-muted-foreground">No actions available</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepositApproval;
