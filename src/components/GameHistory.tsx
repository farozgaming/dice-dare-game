
import React from 'react';
import { useGame } from '@/context/GameContext';
import { History } from 'lucide-react';

const GameHistory: React.FC = () => {
  const { betHistory } = useGame();
  
  // Calculate trends
  const lastFiveResults = betHistory.slice(0, 5);
  const crashCount = lastFiveResults.filter(bet => bet.crashed).length;
  const survivalCount = lastFiveResults.filter(bet => !bet.crashed).length;
  
  // Color intensity based on trend strength
  const crashTrendIntensity = Math.min(crashCount / 5, 1);
  const survivalTrendIntensity = Math.min(survivalCount / 5, 1);
  
  return (
    <div className="glass-panel p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Game History</h3>
      </div>
      
      {/* Trend indicator */}
      <div className="flex justify-between mb-4 text-xs">
        <div className={`p-1.5 rounded bg-game-red/20 text-game-red`}
             style={{ opacity: 0.3 + (crashTrendIntensity * 0.7) }}>
          {crashCount}/5 Crashes
        </div>
        <div className={`p-1.5 rounded bg-game-green/20 text-game-green`}
             style={{ opacity: 0.3 + (survivalTrendIntensity * 0.7) }}>
          {survivalCount}/5 Survivals
        </div>
      </div>
      
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
      
      {/* Statistics Section */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/5 p-2 rounded">
            <p className="text-muted-foreground">Highest</p>
            <p className="text-white font-medium">
              {Math.max(...betHistory.map(b => b.multiplier)).toFixed(2)}x
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <p className="text-muted-foreground">Average</p>
            <p className="text-white font-medium">
              {(betHistory.reduce((acc, b) => acc + b.multiplier, 0) / betHistory.length).toFixed(2)}x
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <p className="text-muted-foreground">Crash %</p>
            <p className="text-white font-medium">
              {Math.round((betHistory.filter(b => b.crashed).length / betHistory.length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
