
import React from 'react';
import Layout from '@/components/layout/Layout';
import GameGrid from '@/components/games/GameGrid';
import { colorGames } from '@/data/games';
import { CircleDot } from 'lucide-react'; // Using CircleDot instead of Wheel which isn't in lucide-react

// Define specific feature games with custom UI to highlight them
const colorWheelGame = {
  id: "color-wheel-1",
  name: "Lucky Color Wheel",
  image: "/placeholder.svg",
  description: "Spin the wheel and match your color to win big prizes!",
  category: "color",
  popularity: 95,
  isHot: true,
  isNew: true,
  provider: "Gala Games"
};

const colorDropGame = {
  id: "color-drop-1",
  name: "Triple Color Drop",
  image: "/placeholder.svg",
  description: "Watch the colors drop and match three to win!",
  category: "color",
  popularity: 92,
  isHot: true,
  isNew: true,
  provider: "Gala Games"
};

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
        
        {/* Featured Color Games with custom UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Color Wheel Game */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-casino-gold mb-2">{colorWheelGame.name}</h2>
                <p className="text-gray-300">{colorWheelGame.description}</p>
              </div>
              <div className="bg-casino-gold rounded-full p-2">
                <CircleDot className="h-8 w-8 text-black" />
              </div>
            </div>
            
            <div className="relative h-48 md:h-64 bg-black/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 rounded-full border-8 border-white animate-spin" style={{ animationDuration: '8s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-4 h-4 bg-white rounded-full"></div>
                  {/* Color segments */}
                  <div className="absolute inset-0 bg-red-500" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }}></div>
                  <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
                  <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }}></div>
                  <div className="absolute inset-0 bg-yellow-500" style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)' }}></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <button className="bg-casino-gold text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition">
                  Play Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Color Drop Game */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-casino-gold mb-2">{colorDropGame.name}</h2>
                <p className="text-gray-300">{colorDropGame.description}</p>
              </div>
              <div className="bg-casino-gold rounded-full p-2">
                <svg className="h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="3" />
                  <path d="M12 8v12" />
                  <circle cx="6" cy="15" r="3" />
                  <circle cx="18" cy="15" r="3" />
                </svg>
              </div>
            </div>
            
            <div className="relative h-48 md:h-64 bg-black/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4">
                <div className="bg-red-500 rounded-lg animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '0.1s' }}></div>
                <div className="bg-blue-500 rounded-lg animate-bounce" style={{ animationDuration: '1.7s', animationDelay: '0.3s' }}></div>
                <div className="bg-green-500 rounded-lg animate-bounce" style={{ animationDuration: '1.9s', animationDelay: '0.5s' }}></div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <button className="bg-casino-gold text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transition">
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rest of games */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">New Color Games</h2>
          <GameGrid games={colorGames.filter(game => game.isNew)} />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Popular Color Games</h2>
          <GameGrid games={colorGames.filter(game => game.isHot)} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Color Games</h2>
          <GameGrid games={colorGames} />
        </div>
      </div>
    </Layout>
  );
};

export default ColorPage;
