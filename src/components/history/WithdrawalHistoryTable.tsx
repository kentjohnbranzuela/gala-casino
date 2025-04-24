
import React from 'react';

// Mock data for withdrawal history
const withdrawalHistory = [
  {
    id: '1',
    method: 'GCash',
    reference: 'WD2504251',
    date: '2025-04-24T18:30:00',
    amount: 2000,
    status: 'processing',
  },
  {
    id: '2',
    method: 'GCash',
    reference: 'WD2504242',
    date: '2025-04-24T12:15:00',
    amount: 1000,
    status: 'transferring',
  },
  {
    id: '3',
    method: 'GCash',
    reference: 'WD2504233',
    date: '2025-04-23T16:20:00',
    amount: 3000,
    status: 'success',
  },
  {
    id: '4',
    method: 'Bank Transfer',
    reference: 'WD2504224',
    date: '2025-04-22T14:45:00',
    amount: 5000,
    status: 'success',
  },
];

const WithdrawalHistoryTable: React.FC = () => {
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
            {withdrawalHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.method}</td>
                <td>{item.reference}</td>
                <td>{new Date(item.date).toLocaleString()}</td>
                <td>₱{item.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${
                    item.status === 'processing' ? 'status-processing' : 
                    item.status === 'transferring' ? 'status-transferring' : 
                    'status-success'
                  }`}>
                    {item.status === 'processing' ? 'PROCESSING' : 
                     item.status === 'transferring' ? 'TRANSFERRING' : 
                     'SUCCESS'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalHistoryTable;
