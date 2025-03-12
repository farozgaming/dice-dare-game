
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
            <div className="glass-panel p-8 h-96 md:h-[500px] flex items-center justify-center animate-zoom-in relative overflow-hidden">
              {/* Background pattern for game area */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
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
      </div>
    </GameProvider>
  );
};

export default CrashGame;
