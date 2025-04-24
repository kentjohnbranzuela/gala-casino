
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { allGames, Game } from '@/data/games';
import { toast } from 'sonner';
import SlotGame from '@/components/games/SlotGame';
import AuthProtection from '@/components/auth/AuthProtection';

const GameDetailPage: React.FC = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [showGameInterface, setShowGameInterface] = useState(false);
  
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
              <SlotGame />
            </div>
          )}
        </div>
      </Layout>
    </AuthProtection>
  );
};

export default GameDetailPage;
