
import React from 'react';
import GameCard from './GameCard';

interface Game {
  id: string;
  title: string;
  image: string;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
}

interface GameGridProps {
  games: Game[];
  title?: string;
}

const GameGrid: React.FC<GameGridProps> = ({ games, title }) => {
  return (
    <div>
      {title && <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            image={game.image}
            category={game.category}
            isNew={game.isNew}
            isHot={game.isHot}
          />
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
