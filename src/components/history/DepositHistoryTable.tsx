
import React, { useState, useEffect } from 'react';

interface Deposit {
  id: string;
  user: string;
  method: string;
  reference: string;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
}

const DepositHistoryTable: React.FC = () => {
  const [depositHistory, setDepositHistory] = useState<Deposit[]>([]);
  const username = localStorage.getItem('username') || '';
  
  useEffect(() => {
    // Load deposit history from localStorage
    const loadDeposits = () => {
      try {
        const storedDeposits = localStorage.getItem('depositRequests');
        if (storedDeposits) {
          const allDeposits = JSON.parse(storedDeposits);
          // Filter only for current user
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
    
    loadDeposits();
    
    // Reload when localStorage changes
    const handleStorageChange = () => {
      loadDeposits();
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
            {depositHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No deposit history found
                </td>
              </tr>
            ) : (
              depositHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.method}</td>
                  <td>{item.id}</td>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td>₱{item.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${
                      item.status === 'pending' ? 'status-processing' : 
                      item.status === 'approved' ? 'status-success' :
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

export default DepositHistoryTable;
