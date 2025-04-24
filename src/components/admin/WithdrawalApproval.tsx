
import React, { useState } from 'react';
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

// Mock data for pending withdrawals
const initialWithdrawals: Withdrawal[] = [
  {
    id: 'w1',
    user: 'User123',
    method: 'GCash',
    accountNumber: '09876543210',
    amount: 1500,
    requestDate: '2025-04-24T15:30:00',
    status: 'processing',
  },
  {
    id: 'w2',
    user: 'User456',
    method: 'Bank Transfer',
    accountNumber: '1234567890',
    amount: 3000,
    requestDate: '2025-04-24T14:15:00',
    status: 'processing',
  },
  {
    id: 'w3',
    user: 'User789',
    method: 'GCash',
    accountNumber: '09123456789',
    amount: 2000,
    requestDate: '2025-04-24T13:45:00',
    status: 'transferring',
  },
  {
    id: 'w4',
    user: 'User101',
    method: 'GCash',
    accountNumber: '09987654321',
    amount: 5000,
    requestDate: '2025-04-24T12:30:00',
    status: 'success',
  },
];

const WithdrawalApproval: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);
  
  const handleUpdateStatus = (id: string, newStatus: 'transferring' | 'success' | 'rejected') => {
    setWithdrawals(withdrawals.map(withdrawal => {
      if (withdrawal.id === id) {
        return { ...withdrawal, status: newStatus };
      }
      return withdrawal;
    }));
    
    // Show success message
    if (newStatus === 'transferring') {
      toast.success('Withdrawal marked as transferring');
    } else if (newStatus === 'success') {
      toast.success('Withdrawal approved and completed');
    } else {
      toast.error('Withdrawal rejected');
    }
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
              {withdrawals.map((withdrawal) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalApproval;
