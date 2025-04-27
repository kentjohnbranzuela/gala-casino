
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { allGames, Game } from '@/data/games';
import { toast } from 'sonner';
import SlotGame from '@/components/games/SlotGame';
import AuthProtection from '@/components/auth/AuthProtection';
import { CircleDot } from 'lucide-react'; // Added for customer service icon

const GameDetailPage: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [showGameInterface, setShowGameInterface] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
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
    setShowGameInterface(true);
  };

  const handleWin = (amount: number) => {
    // Update balance in Header component by triggering a localStorage event
    window.dispatchEvent(new Event('storage:balance:updated'));
    
    // Record game history
    const username = localStorage.getItem('username');
    if (username) {
      const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
      gameHistory.push({
        id: Date.now().toString(),
        username,
        gameName: game?.title || 'Unknown Game',
        gameId: id || '',
        bet: amount / 1.5, // Approximate the bet from the win amount
        win: amount,
        date: new Date().toISOString()
      });
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    }
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
    <AuthProtection>
      <Layout>
        <div className="max-w-4xl mx-auto relative">
          {/* Customer Support Float Button */}
          <div className="fixed bottom-6 right-6 z-10">
            <Button
              className="rounded-full w-14 h-14 bg-casino-gold hover:bg-yellow-500 text-black shadow-lg flex items-center justify-center"
              onClick={() => setShowSupport(!showSupport)}
            >
              <CircleDot className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Customer Support Chat Panel */}
          {showSupport && (
            <div className="fixed bottom-24 right-6 bg-card border border-casino-purple-dark rounded-lg w-80 md:w-96 z-10 shadow-xl">
              <div className="p-4 border-b border-casino-purple-dark flex justify-between items-center">
                <h3 className="font-bold text-white">Customer Support</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSupport(false)}>
                  ✕
                </Button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto bg-casino-dark">
                <p className="text-gray-300 text-sm mb-4">
                  Welcome to Gala Casino support! How can we help you today?
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" className="bg-casino-purple hover:bg-casino-purple-dark text-white text-xs">
                    Promo Codes
                  </Button>
                  <Button size="sm" className="bg-casino-purple hover:bg-casino-purple-dark text-white text-xs">
                    Deposit Issues
                  </Button>
                  <Button size="sm" className="bg-casino-purple hover:bg-casino-purple-dark text-white text-xs">
                    Game Rules
                  </Button>
                </div>
                <div className="mt-4">
                  <textarea 
                    className="w-full bg-casino-purple-dark border border-casino-purple text-white rounded-md p-2 text-sm"
                    placeholder="Type your message here..."
                    rows={3}
                  />
                  <Button className="w-full mt-2 bg-casino-gold text-black">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          )}

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
          
          {!showGameInterface ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-card border border-casino-purple-dark rounded-lg overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-8">
                      <Button 
                        onClick={handlePlay}
                        className="btn-gold py-6 px-12 text-xl"
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-card border border-casino-purple-dark rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Game Info</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Category:</span>
                      <span className="text-white capitalize">{game.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Min Bet:</span>
                      <span className="text-white">₱10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Max Win:</span>
                      <span className="text-white">x9000</span>
                    </div>
                    {game.isNew && (
                      <div className="bg-casino-blue text-white text-center py-1 px-2 rounded">
                        NEW GAME
                      </div>
                    )}
                    {game.isHot && (
                      <div className="bg-casino-red text-white text-center py-1 px-2 rounded">
                        HOT GAME
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <button 
                onClick={() => setShowGameInterface(false)} 
                className="text-casino-gold hover:underline mb-4 flex items-center"
              >
                &larr; Back to game info
              </button>
              <SlotGame onWin={handleWin} />
            </div>
          )}
        </div>
      </Layout>
    </AuthProtection>
  );
};

export default GameDetailPage;
