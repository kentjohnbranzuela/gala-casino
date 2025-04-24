
import React from 'react';
import Layout from '@/components/layout/Layout';
import GameGrid from '@/components/games/GameGrid';
import { fishingGames } from '@/data/games';

const FishingPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Fishing Games</h1>
          <p className="text-gray-300 mt-2">
            Dive into exciting fishing adventures and catch big wins with our selection of fishing games!
          </p>
        </div>
        
        {/* New Fishing Games */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">New Arrivals</h2>
          <GameGrid games={fishingGames.filter(game => game.isNew)} />
        </div>
        
        {/* Hot Fishing Games */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Popular Fishing Games</h2>
          <GameGrid games={fishingGames.filter(game => game.isHot)} />
        </div>
        
        {/* All Fishing Games */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Fishing Games</h2>
          <GameGrid games={fishingGames} />
        </div>
      </div>
    </Layout>
  );
};

export default FishingPage;
