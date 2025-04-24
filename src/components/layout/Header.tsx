
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Coins } from 'lucide-react';
import DepositModal from '../modals/DepositModal';
import WithdrawModal from '../modals/WithdrawModal';

const Header = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const location = useLocation();
  
  // Mock user balance - in a real app, this would come from authentication context
  const balance = 10000;

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
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
              <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
              <Link to="/slots" className={`nav-link ${isActive('/slots')}`}>Slots</Link>
              <Link to="/fishing" className={`nav-link ${isActive('/fishing')}`}>Fishing</Link>
              <Link to="/color" className={`nav-link ${isActive('/color')}`}>Color Games</Link>
              <Link to="/history" className={`nav-link ${isActive('/history')}`}>History</Link>
              <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Admin</Link>
            </nav>
            
            <div className="flex items-center space-x-2">
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
