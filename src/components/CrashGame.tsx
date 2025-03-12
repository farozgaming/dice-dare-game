
import React from 'react';
import { GameProvider } from '@/context/GameContext';
import AnimatedMultiplier from './AnimatedMultiplier';
import BettingPanel from './BettingPanel';
import GameHistory from './GameHistory';
import UserPanel from './UserPanel';
import LivePlayers from './LivePlayers';

const CrashGame: React.FC = () => {
  return (
    <GameProvider>
      <div className="container p-4 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-8 h-96 md:h-[500px] flex items-center justify-center animate-zoom-in relative overflow-hidden rounded-lg border border-white/10">
              {/* Background pattern for game area */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
              {/* Game stats overlay */}
              <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Players: 142</span>
                <span className="mx-1">•</span>
                <span>Total Bets: $12,458</span>
              </div>
              
              <AnimatedMultiplier />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GameHistory />
              <LivePlayers />
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <BettingPanel />
            <UserPanel />
          </div>
        </div>
        
        {/* Game info panel */}
        <div className="mt-6 p-4 rounded-lg glass-panel text-sm">
          <h3 className="text-lg font-medium mb-2">How to Play Crash</h3>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
            <li>Place your bet before the round begins</li>
            <li>Watch as the multiplier increases from 1.00x</li>
            <li>Cash out anytime before the game crashes</li>
            <li>The longer you wait, the higher your potential payout</li>
            <li>Set auto cash out to automatically secure your winnings</li>
          </ol>
        </div>
      </div>
    </GameProvider>
  );
};

export default CrashGame;
