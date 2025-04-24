
import React from 'react';
import Layout from '@/components/layout/Layout';
import GameGrid from '@/components/games/GameGrid';
import { colorGames } from '@/data/games';

const ColorPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Color Games</h1>
          <p className="text-gray-300 mt-2">
            Try your luck with our vibrant selection of color-based games with simple rules and exciting payouts!
          </p>
        </div>
        
        {/* New Color Games */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">New Arrivals</h2>
          <GameGrid games={colorGames.filter(game => game.isNew)} />
        </div>
        
        {/* Hot Color Games */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Popular Color Games</h2>
          <GameGrid games={colorGames.filter(game => game.isHot)} />
        </div>
        
        {/* All Color Games */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Color Games</h2>
          <GameGrid games={colorGames} />
        </div>
      </div>
    </Layout>
  );
};

export default ColorPage;
