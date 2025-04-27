
import React, { useState, useEffect } from 'react';

interface Withdrawal {
  id: string;
  method: string;
  reference: string;
  date: string;
  amount: number;
  status: 'processing' | 'transferring' | 'success' | 'rejected';
}

const WithdrawalHistoryTable: React.FC = () => {
  const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([]);
  const username = localStorage.getItem('username') || '';
  
  useEffect(() => {
    // Load withdrawal history from localStorage
    const loadWithdrawals = () => {
      try {
        const storedWithdrawals = localStorage.getItem('withdrawalRequests');
        if (storedWithdrawals) {
          const allWithdrawals = JSON.parse(storedWithdrawals);
          // Filter only for current user
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
    
    loadWithdrawals();
    
    // Reload when localStorage changes
    const handleStorageChange = () => {
      loadWithdrawals();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [username]);

  return (
    <div className="bg-card border border-casino-purple-dark rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="history-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Reference</th>
              <th>Date & Time</th>
              <th>Amount</th>
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
              withdrawalHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.method}</td>
                  <td>{item.id}</td>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td>₱{item.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${
                      item.status === 'processing' ? 'status-processing' : 
                      item.status === 'transferring' ? 'status-transferring' : 
                      item.status === 'success' ? 'status-success' :
                      'status-failed'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalHistoryTable;
