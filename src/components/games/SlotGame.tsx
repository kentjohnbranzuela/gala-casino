
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface SlotGameProps {
  onWin?: (amount: number) => void;
  initialBet?: number;
}

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];

const SlotGame: React.FC<SlotGameProps> = ({ onWin, initialBet = 100 }) => {
  const [reels, setReels] = useState<string[]>(['❓', '❓', '❓']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bet, setBet] = useState(initialBet);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);

  const handleSpin = () => {
    if (balance < bet) {
      toast.error("Not enough balance to place this bet!");
      return;
    }

    setIsSpinning(true);
    setBalance(prev => prev - bet);
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
      setBalance(prev => prev + win);
      setWinAmount(win);
      toast.success(`You won ₱${win}!`);
      if (onWin) onWin(win);
      return;
    }

    // Check for 2 of a kind
    if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      const win = bet * 1.5;
      setBalance(prev => prev + win);
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
        setBalance(prev => prev + win);
        setWinAmount(win);
        toast.success(`You won ₱${win} with ${sevens} seven(s)!`);
        if (onWin) onWin(win);
        return;
      }
    }

    toast.error("Better luck next time!");
  };

  const handleBetChange = (amount: number) => {
    setBet(prev => Math.max(10, prev + amount));
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
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              disabled={bet <= 10 || isSpinning}
              onClick={() => handleBetChange(-10)}
              className="h-8 w-8 p-0 border-casino-purple"
            >
              -
            </Button>
            <span className="text-white font-bold w-20 text-center">₱{bet}</span>
            <Button 
              size="sm" 
              variant="outline"
              disabled={bet >= 1000 || isSpinning}
              onClick={() => handleBetChange(10)}
              className="h-8 w-8 p-0 border-casino-purple"
            >
              +
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[10, 50, 100, 250].map((amount) => (
            <button
              key={amount}
              onClick={() => setBet(amount)}
              disabled={isSpinning}
              className="py-1 px-2 bg-casino-purple-dark hover:bg-casino-purple rounded border border-casino-purple text-white text-sm"
            >
              ₱{amount}
            </button>
          ))}
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
