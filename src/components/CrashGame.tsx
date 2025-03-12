
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
            <div className="glass-panel p-4 h-96 md:h-[500px] flex items-center justify-center animate-zoom-in relative overflow-hidden rounded-xl border border-primary/20 shadow-xl shadow-primary/10">
              {/* Background pattern for game area */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtMTJ2Nmg2di02aC02em0tMTIgMTJ2Nmg2di02aC02em0wLTZoNnY2aC02di02em0xOCAwdjZoNnYtNmgtNnptLTEyIDZ2NmgtNnYtNmg2em0tNi02di02aDZ2NmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-black via-game-dark to-black opacity-80"></div>
              
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
        
        {/* Game info panel with improved styling */}
        <div className="mt-6 p-5 rounded-xl glass-panel border border-white/10 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md shadow-lg">
          <h3 className="text-lg font-medium mb-4 text-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            How to Play Crash
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ol className="list-decimal pl-5 space-y-2 text-white/70">
                <li>Place your bet before the round begins</li>
                <li>Watch as the multiplier increases from 1.00x</li>
                <li>Cash out anytime before the game crashes</li>
                <li>The longer you wait, the higher your potential payout</li>
                <li>Set auto cash out to automatically secure your winnings</li>
              </ol>
            </div>
            
            <div className="text-white/70 space-y-2 bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-sm"><span className="text-primary font-medium">Pro Tip:</span> Use the auto cash-out feature to automatically secure your winnings at your target multiplier.</p>
              <p className="text-sm"><span className="text-primary font-medium">House Edge:</span> The game has a 1% house edge, giving players a 99% expected return.</p>
              <p className="text-sm"><span className="text-primary font-medium">Fair Play:</span> Each round's result is provably fair and can be verified.</p>
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default CrashGame;
