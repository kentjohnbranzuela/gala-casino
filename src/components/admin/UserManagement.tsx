
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock user data (in a real app, this would come from your backend)
const mockUsers = [
  {
    id: '1',
    username: 'user123',
    registrationDate: '2025-04-24',
    lastLogin: '2025-04-24',
    depositCount: 5,
    withdrawalCount: 2,
    totalDeposits: 10000,
    totalWithdrawals: 8000,
  },
  // Add more mock users as needed
];

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-casino-purple-dark rounded-lg p-6">
        <h2 className="text-xl font-semibold text-casino-gold mb-4">User Accounts</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Deposits</TableHead>
                <TableHead>Withdrawals</TableHead>
                <TableHead>Total Deposits</TableHead>
                <TableHead>Total Withdrawals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.registrationDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.depositCount}</TableCell>
                  <TableCell>{user.withdrawalCount}</TableCell>
                  <TableCell>₱{user.totalDeposits.toLocaleString()}</TableCell>
                  <TableCell>₱{user.totalWithdrawals.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
