
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface Withdrawal {
  id: string;
  user: string;
  method: string;
  accountNumber: string;
  amount: number;
  requestDate: string;
  status: 'processing' | 'transferring' | 'success' | 'rejected';
}

const WithdrawalApproval: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  
  useEffect(() => {
    // Load withdrawal requests from localStorage
    const loadWithdrawals = () => {
      try {
        const storedWithdrawals = localStorage.getItem('withdrawalRequests');
        if (storedWithdrawals) {
          const parsedWithdrawals = JSON.parse(storedWithdrawals);
          setWithdrawals(parsedWithdrawals);
        } else {
          // Initialize with empty array
          localStorage.setItem('withdrawalRequests', JSON.stringify([]));
          setWithdrawals([]);
        }
      } catch (error) {
        console.error("Error loading withdrawals:", error);
        setWithdrawals([]);
      }
    };
    
    loadWithdrawals();
    
    // Set up event listener to reload withdrawals when localStorage changes
    const handleStorageChange = () => {
      loadWithdrawals();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleUpdateStatus = (id: string, newStatus: 'transferring' | 'success' | 'rejected') => {
    const updatedWithdrawals = withdrawals.map(withdrawal => {
      if (withdrawal.id === id) {
        return { ...withdrawal, status: newStatus };
      }
      return withdrawal;
    });
    
    setWithdrawals(updatedWithdrawals);
    localStorage.setItem('withdrawalRequests', JSON.stringify(updatedWithdrawals));
    
    // Get the withdrawal for notifications
    const withdrawal = withdrawals.find(w => w.id === id);
    
    // Show success message
    if (newStatus === 'transferring') {
      toast.success('Withdrawal marked as transferring');
      
      // Simulate SMS notification
      if (withdrawal) {
        console.log(`SMS notification sent to ${withdrawal.accountNumber}: Your withdrawal of ₱${withdrawal.amount} is now being transferred.`);
      }
    } else if (newStatus === 'success') {
      toast.success('Withdrawal approved and completed');
      
      // Simulate SMS notification
      if (withdrawal) {
        console.log(`SMS notification sent to ${withdrawal.accountNumber}: Your withdrawal of ₱${withdrawal.amount} has been successfully completed.`);
      }
    } else {
      toast.error('Withdrawal rejected');
      
      // Simulate SMS notification for rejection
      if (withdrawal) {
        console.log(`SMS notification sent to ${withdrawal.accountNumber}: Your withdrawal request of ₱${withdrawal.amount} has been rejected.`);
      }
    }
    
    // Trigger event to update user's withdrawal history
    window.dispatchEvent(new Event('storage'));
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Withdrawal Approvals</h1>
      
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
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>{withdrawal.user}</td>
                    <td>{withdrawal.method}</td>
                    <td>{withdrawal.accountNumber}</td>
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
                    <td>
                      <div className="flex gap-2">
                        {withdrawal.status === 'processing' && (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleUpdateStatus(withdrawal.id, 'transferring')}
                          >
                            Mark Transferring
                          </Button>
                        )}
                        
                        {withdrawal.status === 'transferring' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleUpdateStatus(withdrawal.id, 'success')}
                          >
                            <Check className="mr-1 h-4 w-4" /> Complete
                          </Button>
                        )}
                        
                        {(withdrawal.status === 'processing' || withdrawal.status === 'transferring') && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUpdateStatus(withdrawal.id, 'rejected')}
                          >
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        )}
                        
                        {(withdrawal.status === 'success' || withdrawal.status === 'rejected') && (
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

export default WithdrawalApproval;
