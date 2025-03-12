
import React from 'react';
import { useGame } from '@/context/GameContext';
import { User, Wallet, BarChart, TrendingUp } from 'lucide-react';

const UserPanel: React.FC = () => {
  const { userBalance, streakCount, betHistory } = useGame();
  
  // Dummy user data - in a real app, this would come from user context/API
  const userData = {
    username: 'Player123',
    level: 12,
    wager: 4850.00,
  };
  
  // Calculate win rate
  const totalBets = betHistory.length;
  const wonBets = betHistory.filter(bet => !bet.crashed).length;
  const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0;
  
  // Determine level status
  const levelProgress = 65; // This would be dynamic in a real app
  
  return (
    <div className="glass-panel p-6 animate-slide-up border-t-2 border-t-accent/30">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-accent" />
          <h3 className="text-base font-medium text-white">My Account</h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs">
            Level {userData.level}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-muted/30 p-4 rounded-lg border border-white/5">
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Wallet className="w-3.5 h-3.5 mr-1.5" />
            <span>Balance</span>
          </div>
          <div className="text-xl font-bold text-white">${userBalance.toFixed(2)}</div>
          
          {/* Level progress */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Level Progress</span>
              <span>{levelProgress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div 
                className="bg-accent h-1.5 rounded-full" 
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Win Rate</span>
            </div>
            <div className="font-medium text-white flex items-baseline">
              <span className="text-lg">{winRate}%</span>
              <span className="text-xs text-muted-foreground ml-1">({wonBets}/{totalBets})</span>
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <BarChart className="w-3 h-3 mr-1" />
              <span>Total Wagered</span>
            </div>
            <div className="font-medium text-white text-lg">
              ${userData.wager.toFixed(2)}
            </div>
          </div>
        </div>
        
        <button className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 transition-all duration-200 flex items-center justify-center">
          <Wallet className="w-4 h-4 mr-2" />
          Deposit
        </button>
        
        {streakCount > 2 && (
          <div className="text-xs text-center text-muted-foreground mt-2">
            <span className="text-game-yellow">Hot streak!</span> Cash out soon for maximum safety
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
