
import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  isNew?: boolean;
  isHot?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ id, title, image, category, isNew, isHot }) => {
  return (
    <Link to={`/${category}/${id}`} className="game-card">
      <div className="relative aspect-[4/3]">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <button className="btn-gold w-full">Play Now</button>
        </div>
        {isNew && (
          <div className="absolute top-2 left-2 bg-casino-blue px-2 py-0.5 rounded text-xs font-bold">
            NEW
          </div>
        )}
        {isHot && (
          <div className="absolute top-2 right-2 bg-casino-red px-2 py-0.5 rounded text-xs font-bold">
            HOT
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-white truncate">{title}</h3>
      </div>
    </Link>
  );
};

export default GameCard;
