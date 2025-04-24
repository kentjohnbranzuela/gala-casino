
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-casino-dark border-t border-casino-purple-dark py-6 mt-auto">
      <div className="casino-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-casino-gold font-semibold mb-3">Gala Casino</h3>
            <p className="text-sm text-gray-300">
              Experience the thrill of real casino gaming online.
            </p>
          </div>
          
          <div>
            <h3 className="text-casino-gold font-semibold mb-3">Games</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/slots" className="hover:text-white">Slots</Link></li>
              <li><Link to="/fishing" className="hover:text-white">Fishing Games</Link></li>
              <li><Link to="/color" className="hover:text-white">Color Games</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-casino-gold font-semibold mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/history" className="hover:text-white">Game History</Link></li>
              <li><Link to="/history/deposits" className="hover:text-white">Deposit History</Link></li>
              <li><Link to="/history/withdrawals" className="hover:text-white">Withdrawal History</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-casino-gold font-semibold mb-3">Support</h3>
            <p className="text-sm text-gray-300 mb-2">
              Need assistance? Contact us:
            </p>
            <p className="text-sm text-casino-gold">09917104135</p>
          </div>
        </div>
        
        <div className="border-t border-casino-purple-dark mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {currentYear} Gala Casino. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
