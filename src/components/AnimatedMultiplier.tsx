
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Rocket, AlertTriangle, Timer } from 'lucide-react';

const AnimatedMultiplier: React.FC = () => {
  const { gameState, currentMultiplier, countdown } = useGame();
  
  return (
    <div className={`multiplier-container ${gameState}`}>
      {gameState === 'waiting' ? (
        <div className="flex flex-col items-center justify-center space-y-3 animate-pulse-opacity">
          <Timer className="w-12 h-12 text-muted-foreground opacity-80" />
          <p className="text-lg text-muted-foreground">Next round in</p>
          <p className="text-5xl md:text-7xl font-bold text-white countdown-timer">{countdown}s</p>
        </div>
      ) : gameState === 'crashed' ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-game-red mb-2 animate-bounce" />
          <p className="text-lg text-game-red font-medium">CRASHED AT</p>
          <div className="explosion-animation">
            <p className="multiplier text-6xl md:text-8xl font-bold text-game-red text-stroke animate-crash-down">
              {currentMultiplier.toFixed(2)}x
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3">
          <Rocket className="w-12 h-12 text-game-green mb-2 rocket-animation" />
          <p className="text-lg text-game-green font-medium">CURRENT MULTIPLIER</p>
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-game-green/20 rounded-full animate-pulse" 
                 style={{ transform: `scale(${1 + (currentMultiplier * 0.05)})` }}></div>
            <p className="multiplier text-6xl md:text-8xl font-bold text-game-green text-stroke relative z-10">
              {currentMultiplier.toFixed(2)}x
            </p>
          </div>
          
          {/* Trail effect for multiplier growth */}
          <div className="flex space-x-1 text-xs text-game-green/60 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                ▲
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedMultiplier;
