
import React from 'react';
import { useGame } from '@/context/GameContext';

const GameHistory: React.FC = () => {
  const { betHistory } = useGame();
  
  return (
    <div className="glass-panel p-4 animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Game History</h3>
      
      <div className="flex flex-wrap gap-2">
        {betHistory.map((bet) => (
          <div
            key={bet.id}
            className={`history-dot ${bet.crashed ? 'history-dot-lose' : 'history-dot-win'}`}
            title={`${bet.multiplier.toFixed(2)}x`}
          >
            {bet.multiplier.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;
