
import React from 'react';
import Layout from '@/components/layout/Layout';
import GameGrid from '@/components/games/GameGrid';
import { slotGames } from '@/data/games';

const SlotsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Slot Games</h1>
          <p className="text-gray-300 mt-2">
            Experience the thrill of our wide selection of slot games with amazing graphics and big jackpots!
          </p>
        </div>
        
        {/* New Slots */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">New Arrivals</h2>
          <GameGrid games={slotGames.filter(game => game.isNew)} />
        </div>
        
        {/* Hot Slots */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Popular Slots</h2>
          <GameGrid games={slotGames.filter(game => game.isHot)} />
        </div>
        
        {/* All Slots */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Slots</h2>
          <GameGrid games={slotGames} />
        </div>
      </div>
    </Layout>
  );
};

export default SlotsPage;
