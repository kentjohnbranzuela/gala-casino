
import React from 'react';

// Mock data for game history
const gameHistory = [
  {
    id: '1',
    game: 'Lucky Dragon Slot',
    date: '2025-04-24T14:30:00',
    betAmount: 100,
    winAmount: 250,
    result: 'win',
  },
  {
    id: '2',
    game: 'Golden Fish Hunter',
    date: '2025-04-24T12:15:00',
    betAmount: 50,
    winAmount: 0,
    result: 'loss',
  },
  {
    id: '3',
    game: 'Fortune Color Wheel',
    date: '2025-04-24T11:00:00',
    betAmount: 200,
    winAmount: 600,
    result: 'win',
  },
  {
    id: '4',
    game: 'Wild West Slot',
    date: '2025-04-23T18:45:00',
    betAmount: 150,
    winAmount: 0,
    result: 'loss',
  },
  {
    id: '5',
    game: 'Deep Sea Treasures',
    date: '2025-04-23T14:20:00',
    betAmount: 75,
    winAmount: 225,
    result: 'win',
  },
];

const GameHistoryTable: React.FC = () => {
  return (
    <div className="bg-card border border-casino-purple-dark rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="history-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>Date & Time</th>
              <th>Bet Amount</th>
              <th>Win Amount</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {gameHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.game}</td>
                <td>{new Date(item.date).toLocaleString()}</td>
                <td>₱{item.betAmount.toLocaleString()}</td>
                <td>₱{item.winAmount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${item.result === 'win' ? 'status-success' : 'status-failed'}`}>
                    {item.result === 'win' ? 'WON' : 'LOST'}
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

export default GameHistoryTable;
