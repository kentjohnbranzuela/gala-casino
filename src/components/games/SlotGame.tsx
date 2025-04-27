
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SlotGameProps {
  onWin?: (amount: number) => void;
  initialBet?: number;
}

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
const BET_OPTIONS = [10, 20, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

const SlotGame: React.FC<SlotGameProps> = ({ onWin, initialBet = 100 }) => {
  const [reels, setReels] = useState<string[]>(['❓', '❓', '❓']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bet, setBet] = useState(initialBet);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);

  useEffect(() => {
    // Fetch user's balance from localStorage when component mounts
    const username = localStorage.getItem('username');
    if (username) {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const currentUser = users.find((user: any) => user.username === username);
        if (currentUser) {
          setBalance(currentUser.balance || 1000);
        }
      }
    }
  }, []);

  const updateUserBalance = (newBalance: number) => {
    const username = localStorage.getItem('username');
    if (username) {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((user: any) => {
          if (user.username === username) {
            return { ...user, balance: newBalance };
          }
          return user;
        });
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
    }
  };

  const handleSpin = () => {
    if (balance < bet) {
      toast.error("Not enough balance to place this bet!");
      return;
    }

    setIsSpinning(true);
    const newBalance = balance - bet;
    setBalance(newBalance);
    updateUserBalance(newBalance);
    
    setWinAmount(0);

    // Simulate spinning animation
    const spinInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);
    }, 100);

    // Stop after 2 seconds
    setTimeout(() => {
      clearInterval(spinInterval);
      const finalReels = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ];
      setReels(finalReels);
      checkWin(finalReels);
      setIsSpinning(false);
    }, 2000);
  };

  const checkWin = (reels: string[]) => {
    // Check for 3 of a kind
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const multiplier = SYMBOLS.indexOf(reels[0]) + 3; // Higher value symbols have higher multipliers
      const win = bet * multiplier;
      const newBalance = balance + win;
      setBalance(newBalance);
      updateUserBalance(newBalance);
      setWinAmount(win);
      toast.success(`You won ₱${win}!`);
      if (onWin) onWin(win);
      return;
    }

    // Check for 2 of a kind
    if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      const win = bet * 1.5;
      const newBalance = balance + win;
      setBalance(newBalance);
      updateUserBalance(newBalance);
      setWinAmount(win);
      toast.success(`You won ₱${win}!`);
      if (onWin) onWin(win);
      return;
    }

    // Special case for any 7's
    if (reels.includes('7️⃣')) {
      const sevens = reels.filter(r => r === '7️⃣').length;
      if (sevens > 0) {
        const win = bet * sevens;
        const newBalance = balance + win;
        setBalance(newBalance);
        updateUserBalance(newBalance);
        setWinAmount(win);
        toast.success(`You won ₱${win} with ${sevens} seven(s)!`);
        if (onWin) onWin(win);
        return;
      }
    }

    toast.error("Better luck next time!");
  };

  return (
    <div className="bg-card border border-casino-purple-dark rounded-lg p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="text-xl font-bold text-white mb-2">Balance: ₱{balance}</div>
        {winAmount > 0 && (
          <div className="text-xl font-bold text-casino-gold animate-pulse">Win: ₱{winAmount}</div>
        )}
      </div>

      <div className="flex justify-center mb-8 bg-casino-dark p-6 rounded-lg">
        <div className="flex gap-4">
          {reels.map((symbol, index) => (
            <div 
              key={index} 
              className={`w-20 h-20 flex items-center justify-center text-4xl bg-gradient-to-b from-casino-purple to-casino-purple-dark border-2 border-casino-gold rounded-lg ${
                isSpinning ? "animate-pulse" : ""
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white">Bet Amount:</span>
          <div className="w-40">
            <Select
              value={bet.toString()}
              onValueChange={(value) => setBet(parseInt(value))}
              disabled={isSpinning}
            >
              <SelectTrigger className="w-full border-casino-purple bg-casino-dark text-white">
                <SelectValue placeholder="Select bet" />
              </SelectTrigger>
              <SelectContent>
                {BET_OPTIONS.map(option => (
                  <SelectItem key={option} value={option.toString()}>₱{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSpin}
        disabled={isSpinning}
        className="btn-gold w-full py-6 text-lg"
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </Button>

      <div className="mt-4 text-xs text-gray-400">
        <p>Three matching symbols: Up to 9x your bet</p>
        <p>Two matching symbols: 1.5x your bet</p>
        <p>Any 7: 1x your bet per seven</p>
      </div>
    </div>
  );
};

export default SlotGame;
