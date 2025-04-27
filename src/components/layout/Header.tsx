
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Coins, LogOut, User } from 'lucide-react';
import DepositModal from '../modals/DepositModal';
import WithdrawModal from '../modals/WithdrawModal';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const Header = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  const userType = localStorage.getItem('userType');
  const username = localStorage.getItem('username');
  const isAdmin = userType === 'admin';
  
  useEffect(() => {
    // Fetch user's balance from localStorage or initialize if first time
    if (!isAdmin && username) {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const currentUser = users.find((user: any) => user.username === username);
        if (currentUser) {
          // Get balance or set to 0 if not exists
          const userBalance = currentUser.balance || 0;
          setBalance(userBalance);
        }
      }
    }
  }, [username, isAdmin]);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    toast.success('Successfully logged out');
    navigate('/login');
  };

  return (
    <header className="bg-casino-dark border-b border-casino-purple-dark py-4">
      <div className="casino-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold text-casino-gold">
              Gala Casino
            </Link>
          </div>
          
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-4 mr-6">
              {!isAdmin && (
                <>
                  <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                  <Link to="/slots" className={`nav-link ${isActive('/slots')}`}>Slots</Link>
                  <Link to="/fishing" className={`nav-link ${isActive('/fishing')}`}>Fishing</Link>
                  <Link to="/color" className={`nav-link ${isActive('/color')}`}>Color Games</Link>
                  <Link to="/history" className={`nav-link ${isActive('/history')}`}>History</Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Admin Panel</Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-2">
              {!isAdmin && (
                <>
                  <div className="bg-casino-purple-dark rounded-md py-1 px-3 mr-2 flex items-center">
                    <Coins className="w-4 h-4 text-casino-gold mr-2" />
                    <span className="text-white">₱{balance.toLocaleString()}</span>
                  </div>
                  
                  <Button 
                    onClick={() => setIsDepositModalOpen(true)}
                    className="btn-casino"
                  >
                    <Wallet className="w-4 h-4 mr-1" /> Deposit
                  </Button>
                  
                  <Button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="btn-gold"
                  >
                    Withdraw
                  </Button>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-casino-purple-dark text-white">
                        {username ? username[0].toUpperCase() : (isAdmin ? 'A' : 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="flex items-center cursor-pointer"
                    disabled={isAdmin}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {isDepositModalOpen && <DepositModal onClose={() => setIsDepositModalOpen(false)} />}
      {isWithdrawModalOpen && <WithdrawModal onClose={() => setIsWithdrawModalOpen(false)} />}
    </header>
  );
};

export default Header;
