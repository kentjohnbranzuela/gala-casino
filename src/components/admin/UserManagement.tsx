
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface User {
  id: string;
  username: string;
  registrationDate: string;
  lastLogin: string;
  depositCount: number;
  withdrawalCount: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    // Get registered users from localStorage
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
        } else {
          // If no users found, initialize with empty array
          localStorage.setItem('registeredUsers', JSON.stringify([]));
          setUsers([]);
        }
      } catch (error) {
        console.error("Error loading users:", error);
        setUsers([]);
      }
    };

    loadUsers();
    
    // Set up event listener to reload users when storage changes
    const handleStorageChange = () => loadUsers();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(1, Math.ceil(users.length / usersPerPage));

  // Default mock user to show if no users are registered
  const mockDefaultUser = {
    id: '1',
    username: 'user123',
    registrationDate: '2025-04-24',
    lastLogin: '2025-04-24',
    depositCount: 5,
    withdrawalCount: 2,
    totalDeposits: 10000,
    totalWithdrawals: 8000,
  };

  const displayUsers = users.length > 0 ? currentUsers : [mockDefaultUser];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-casino-purple-dark rounded-lg p-6">
        <h2 className="text-xl font-semibold text-casino-gold mb-4">User Accounts</h2>
        
        {users.length === 0 && (
          <div className="py-2 text-yellow-500 mb-4">
            No registered users found. Users will appear here when they register.
          </div>
        )}
        
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
              {displayUsers.map((user) => (
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
        
        {users.length > usersPerPage && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
