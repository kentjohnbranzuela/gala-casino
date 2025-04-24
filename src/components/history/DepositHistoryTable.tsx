
import React from 'react';

// Mock data for deposit history
const depositHistory = [
  {
    id: '1',
    method: 'GCash',
    reference: 'GC2504251',
    date: '2025-04-24T16:30:00',
    amount: 1000,
    status: 'success',
  },
  {
    id: '2',
    method: 'GCash',
    reference: 'GC2504242',
    date: '2025-04-24T10:15:00',
    amount: 500,
    status: 'success',
  },
  {
    id: '3',
    method: 'GCash',
    reference: 'GC2504233',
    date: '2025-04-23T14:20:00',
    amount: 2000,
    status: 'success',
  },
  {
    id: '4',
    method: 'Bank Transfer',
    reference: 'BT2504224',
    date: '2025-04-22T11:45:00',
    amount: 5000,
    status: 'success',
  },
];

const DepositHistoryTable: React.FC = () => {
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
            {depositHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.method}</td>
                <td>{item.reference}</td>
                <td>{new Date(item.date).toLocaleString()}</td>
                <td>₱{item.amount.toLocaleString()}</td>
                <td>
                  <span className="status-badge status-success">
                    SUCCESS
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

export default DepositHistoryTable;
