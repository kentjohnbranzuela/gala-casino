
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Coins, LogOut, User, Mail } from 'lucide-react';
import DepositModal from '../modals/DepositModal';
import WithdrawalModal from '../modals/WithdrawModal';
import { Avatar, AvatarFallback } from '../ui/avatar';
import AdminNotifications from '../admin/AdminNotifications';
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
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const userType = localStorage.getItem('userType') || sessionStorage.getItem('userType');
  const username = localStorage.getItem('username') || sessionStorage.getItem('username');
  const isAdmin = userType === 'admin';
  
  const updateBalance = () => {
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
  };
  
  useEffect(() => {
    updateBalance();
    
    // Listen for balance updates from the game
    const handleStorageEvent = () => {
      updateBalance();
    };
    
    window.addEventListener('storage:balance:updated', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage:balance:updated', handleStorageEvent);
    };
  }, [username, isAdmin]);

  useEffect(() => {
    // Check for unread customer service messages
    if (isAdmin) {
      const checkForNewMessages = () => {
        const storedMessages = localStorage.getItem('customerServiceMessages');
        if (storedMessages) {
          const messages = JSON.parse(storedMessages);
          const unreadMessages = messages.filter((msg: any) => !msg.read);
          setHasNewMessages(unreadMessages.length > 0);
        }
      };
      
      checkForNewMessages();
      
      // Check every 30 seconds for new messages
      const interval = setInterval(checkForNewMessages, 30000);
      
      // Listen for new customer service messages
      const handleNewMessage = () => {
        checkForNewMessages();
      };
      
      window.addEventListener('customerService:new-message', handleNewMessage);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('customerService:new-message', handleNewMessage);
      };
    }
  }, [isAdmin]);

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    toast.success('Successfully logged out');
    navigate('/login');
  };
  
  // SMS notification function
  const sendSMSNotification = (phoneNumber: string, message: string) => {
    if (phoneNumber) {
      console.info(`SMS notification sent to ${phoneNumber}: ${message}`);
      return true;
    }
    return false;
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
                <>
                  <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Admin Panel</Link>
                  <Button 
                    variant="ghost" 
                    className="relative"
                    onClick={() => navigate('/admin?tab=support')}
                  >
                    <Mail className="w-5 h-5" />
                    {hasNewMessages && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                  <AdminNotifications />
                </>
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
      {isWithdrawModalOpen && <WithdrawalModal onClose={() => setIsWithdrawModalOpen(false)} />}
    </header>
  );
};

export default Header;
