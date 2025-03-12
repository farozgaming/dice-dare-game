
import React from 'react';
import { useGame } from '@/context/GameContext';
import { History, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const GameHistory: React.FC = () => {
  const { betHistory } = useGame();
  
  // Calculate trends with professional gambling site analytics
  const lastFiveResults = betHistory.slice(0, 5);
  const crashCount = lastFiveResults.filter(bet => bet.crashed).length;
  const survivalCount = lastFiveResults.filter(bet => !bet.crashed).length;
  
  // Calculate streak types
  const consecutiveCrashes = getConsecutiveCount(betHistory, true);
  const consecutiveSurvivals = getConsecutiveCount(betHistory, false);
  
  // Color intensity based on trend strength
  const crashTrendIntensity = Math.min(crashCount / 5, 1);
  const survivalTrendIntensity = Math.min(survivalCount / 5, 1);
  
  // Calculate advanced statistics
  const allMultipliers = betHistory.map(bet => bet.multiplier);
  const highestMultiplier = Math.max(...allMultipliers);
  const averageMultiplier = allMultipliers.reduce((sum, val) => sum + val, 0) / allMultipliers.length;
  const medianMultiplier = getMedian(allMultipliers);
  const crashPercentage = (betHistory.filter(b => b.crashed).length / betHistory.length) * 100;
  
  // Visualization colors
  const getMultiplierColor = (multiplier: number): string => {
    if (multiplier < 1.5) return 'text-red-400';
    if (multiplier < 2) return 'text-yellow-400';
    if (multiplier < 3) return 'text-green-400';
    if (multiplier < 5) return 'text-blue-400';
    return 'text-purple-400';
  };
  
  return (
    <div className="glass-panel p-4 animate-slide-up rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-white">Game History</h3>
        </div>
        
        <div className="flex items-center gap-1 text-xs">
          {consecutiveCrashes > 2 && (
            <div className="bg-game-red/20 text-game-red px-2 py-0.5 rounded flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              {consecutiveCrashes} Crashes
            </div>
          )}
          
          {consecutiveSurvivals > 2 && (
            <div className="bg-game-green/20 text-game-green px-2 py-0.5 rounded flex items-center ml-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {consecutiveSurvivals} Survivals
            </div>
          )}
        </div>
      </div>
      
      {/* Trend indicator with improved visuals */}
      <div className="flex justify-between mb-3 text-xs">
        <div className={`p-1.5 rounded bg-game-red/20 text-game-red`}
             style={{ opacity: 0.3 + (crashTrendIntensity * 0.7) }}>
          {crashCount}/5 Crashes
        </div>
        <div className={`p-1.5 rounded bg-game-green/20 text-game-green`}
             style={{ opacity: 0.3 + (survivalTrendIntensity * 0.7) }}>
          {survivalCount}/5 Survivals
        </div>
      </div>
      
      {/* Visual history display */}
      <div className="flex flex-wrap gap-2 mb-3">
        {betHistory.map((bet) => (
          <div
            key={bet.id}
            className={`history-dot ${bet.crashed ? 'history-dot-lose' : 'history-dot-win'}`}
            title={`${bet.multiplier.toFixed(2)}x ${bet.crashed ? '(Crashed)' : '(Cashed Out)'}`}
          >
            <span className={getMultiplierColor(bet.multiplier)}>
              {bet.multiplier.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Enhanced Statistics Section */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1 mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Round Statistics</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-white/5 p-2 rounded">
            <p className="text-muted-foreground">Highest</p>
            <p className="text-white font-medium">
              {highestMultiplier.toFixed(2)}x
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <p className="text-muted-foreground">Average</p>
            <p className="text-white font-medium">
              {averageMultiplier.toFixed(2)}x
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <p className="text-muted-foreground">Median</p>
            <p className="text-white font-medium">
              {medianMultiplier.toFixed(2)}x
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <p className="text-muted-foreground">Crash %</p>
            <p className="text-white font-medium">
              {Math.round(crashPercentage)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for consecutive count
function getConsecutiveCount(history: Array<{crashed: boolean}>, checkCrashed: boolean): number {
  let count = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i].crashed === checkCrashed) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

// Helper function to calculate median
function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

export default GameHistory;
