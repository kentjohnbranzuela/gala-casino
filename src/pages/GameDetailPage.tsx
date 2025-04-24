
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { allGames, Game } from '@/data/games';
import { toast } from 'sonner';

const GameDetailPage: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  useEffect(() => {
    // Find the game by id
    const foundGame = allGames.find(g => g.id === id);
    if (foundGame) {
      setGame(foundGame);
    } else {
      navigate('/');
      toast.error('Game not found');
    }
  }, [id, navigate]);
  
  const handlePlay = () => {
    if (betAmount < 10) {
      toast.error('Minimum bet amount is ₱10');
      return;
    }
    
    setIsPlaying(true);
    
    // Simulate game play - in a real implementation, this would be more complex
    setTimeout(() => {
      const randomWin = Math.random() > 0.6;
      const winAmount = randomWin ? betAmount * (Math.floor(Math.random() * 3) + 1) : 0;
      
      setIsPlaying(false);
      
      if (randomWin) {
        toast.success(`Congratulations! You won ₱${winAmount}!`);
      } else {
        toast.error('Better luck next time!');
      }
    }, 2000);
  };
  
  if (!game) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-white">Loading...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(`/${game.category}`)} 
            className="text-casino-gold hover:underline mb-4 flex items-center"
          >
            &larr; Back to {game.category} games
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
          {game.description && (
            <p className="text-gray-300">{game.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-card border border-casino-purple-dark rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-t-casino-gold border-r-casino-gold border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white text-xl">Game in progress...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-card border border-casino-purple-dark rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Place Your Bet</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bet Amount (₱)
                  </label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setBetAmount(prev => Math.max(10, prev - 10))}
                      className="px-3 py-1 bg-casino-purple-dark rounded-l-md"
                    >
                      -
                    </button>
                    <input 
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      className="w-full bg-muted border-casino-purple-dark text-center py-1"
                      min="10"
                    />
                    <button 
                      onClick={() => setBetAmount(prev => prev + 10)}
                      className="px-3 py-1 bg-casino-purple-dark rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-300">
                  <button onClick={() => setBetAmount(50)}>₱50</button>
                  <button onClick={() => setBetAmount(100)}>₱100</button>
                  <button onClick={() => setBetAmount(200)}>₱200</button>
                  <button onClick={() => setBetAmount(500)}>₱500</button>
                </div>
                
                <Button
                  className="btn-gold w-full py-6 text-lg"
                  onClick={handlePlay}
                  disabled={isPlaying}
                >
                  {isPlaying ? 'Playing...' : 'Play Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameDetailPage;
