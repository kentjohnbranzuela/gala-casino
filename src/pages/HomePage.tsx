
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import GameGrid from '@/components/games/GameGrid';
import { featuredGames, slotGames, fishingGames, colorGames } from '@/data/games';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Banner */}
        <Carousel className="mb-8">
          <CarouselContent>
            <CarouselItem>
              <div className="relative h-[300px] rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-casino-gradient">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <h1 className="text-4xl md:text-5xl font-bold text-casino-gold mb-4 animate-pulse-gold">
                        Welcome to Gala Casino
                      </h1>
                      <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-6">
                        Experience the thrill of real casino gaming online with amazing slots, fishing games, and more!
                      </p>
                      <button className="btn-gold text-lg py-3 px-8">
                        Play Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        
        {/* Featured Games */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Featured Games</h2>
            <a href="/games" className="text-casino-gold hover:text-casino-gold/80 text-sm">
              View All Games
            </a>
          </div>
          <GameGrid games={featuredGames} />
        </section>
        
        {/* Slots Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Popular Slot Games</h2>
            <a href="/slots" className="text-casino-gold hover:text-casino-gold/80 text-sm">
              View All Slots
            </a>
          </div>
          <GameGrid games={slotGames.slice(0, 5)} />
        </section>
        
        {/* Fishing Games Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Fishing Games</h2>
            <a href="/fishing" className="text-casino-gold hover:text-casino-gold/80 text-sm">
              View All Fishing Games
            </a>
          </div>
          <GameGrid games={fishingGames.slice(0, 5)} />
        </section>
        
        {/* Color Games Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Color Games</h2>
            <a href="/color" className="text-casino-gold hover:text-casino-gold/80 text-sm">
              View All Color Games
            </a>
          </div>
          <GameGrid games={colorGames.slice(0, 5)} />
        </section>
        
        {/* Payment Info */}
        <section className="bg-card rounded-lg p-6 border border-casino-purple-dark">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-muted p-4 border-casino-purple-dark">
              <h3 className="text-xl font-semibold text-casino-gold mb-2">Easy Deposits</h3>
              <p className="text-sm text-gray-300">
                Deposit instantly using GCash or bank transfer. Your account will be credited immediately.
              </p>
            </Card>
            
            <Card className="bg-muted p-4 border-casino-purple-dark">
              <h3 className="text-xl font-semibold text-casino-gold mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-300">
                All transactions are encrypted and processed securely through our trusted payment gateways.
              </p>
            </Card>
            
            <Card className="bg-muted p-4 border-casino-purple-dark">
              <h3 className="text-xl font-semibold text-casino-gold mb-2">Fast Withdrawals</h3>
              <p className="text-sm text-gray-300">
                Withdrawals are processed within 24-48 hours directly to your GCash account or bank.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
