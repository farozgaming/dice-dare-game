
import React from 'react';
import { useGame } from '@/context/GameContext';

const AnimatedMultiplier: React.FC = () => {
  const { gameState, currentMultiplier, countdown } = useGame();
  
  return (
    <div className={`multiplier-container ${gameState}`}>
      {gameState === 'waiting' ? (
        <div className="flex flex-col items-center justify-center space-y-2 animate-pulse-opacity">
          <p className="text-lg text-muted-foreground">Next round in</p>
          <p className="text-5xl md:text-7xl font-bold text-white">{countdown}s</p>
        </div>
      ) : gameState === 'crashed' ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-lg text-game-red font-medium">CRASHED AT</p>
          <p className="multiplier text-6xl md:text-8xl font-bold text-game-red text-stroke">
            {currentMultiplier.toFixed(2)}x
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-lg text-game-green font-medium">CURRENT MULTIPLIER</p>
          <p className="multiplier text-6xl md:text-8xl font-bold text-game-green text-stroke">
            {currentMultiplier.toFixed(2)}x
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimatedMultiplier;
