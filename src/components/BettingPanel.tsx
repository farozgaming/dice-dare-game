
import React from 'react';
import { Input } from "@/components/ui/input";
import { useGame } from '@/context/GameContext';
import BetAmount from './BetAmount';
import { CreditCard, Target, Ban, Zap } from 'lucide-react';

const BettingPanel: React.FC = () => {
  const { 
    gameState, 
    currentMultiplier, 
    betAmount, 
    autoCashoutAt,
    setAutoCashoutAt,
    isBetting,
    hasCashedOut,
    placeBet,
    cashOut,
    cancelBet,
    streakCount
  } = useGame();
  
  const handleAutoCashoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === 'waiting' && !isBetting) {
      const value = parseFloat(e.target.value);
      if (!isNaN(value) && value >= 1) {
        setAutoCashoutAt(value);
      }
    }
  };
  
  // Calculate potential payout
  const potentialPayout = betAmount * (hasCashedOut ? currentMultiplier : autoCashoutAt);
  
  return (
    <div className="glass-panel p-6 animate-slide-up border-t-2 border-t-primary/30">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-4 h-4 text-primary" />
        <h3 className="text-base font-medium text-white">Place your bet</h3>
        
        {streakCount > 0 && (
          <div className="ml-auto bg-game-yellow/20 text-game-yellow text-xs px-2 py-1 rounded-full flex items-center">
            <Zap className="w-3 h-3 mr-1" /> {streakCount} streak
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <BetAmount />
        
        <div className="space-y-3">
          <div className="flex items-center">
            <label className="text-sm font-medium text-muted-foreground flex items-center">
              <Target className="w-3.5 h-3.5 mr-1.5" />
              Auto Cash Out
            </label>
          </div>
          
          <Input
            type="number"
            value={autoCashoutAt}
            onChange={handleAutoCashoutChange}
            className="game-input w-full"
            min="1.01"
            step="0.01"
            disabled={gameState !== 'waiting' || isBetting}
          />
        </div>
        
        <div className="flex items-center justify-between p-3 rounded bg-white/5 text-sm">
          <span className="text-muted-foreground">Potential profit:</span>
          <span className="font-medium text-white">${(potentialPayout - betAmount).toFixed(2)}</span>
        </div>
        
        {gameState === 'waiting' && !isBetting && (
          <button
            className="bet-action-primary group relative overflow-hidden animate-fade-in"
            onClick={placeBet}
            disabled={betAmount <= 0}
          >
            <span className="relative z-10 flex items-center justify-center">
              <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Place Bet
            </span>
            <span className="absolute inset-0 bg-primary/30 w-0 group-hover:w-full transition-all duration-300"></span>
          </button>
        )}
        
        {gameState === 'waiting' && isBetting && (
          <button
            className="bet-action-red group relative overflow-hidden animate-fade-in"
            onClick={cancelBet}
          >
            <span className="relative z-10 flex items-center justify-center">
              <Ban className="w-4 h-4 mr-2" />
              Cancel Bet
            </span>
          </button>
        )}
        
        {gameState === 'in-progress' && isBetting && !hasCashedOut && (
          <button
            className="bet-action-primary group relative overflow-hidden animate-fade-in pulse-button"
            onClick={cashOut}
          >
            <span className="relative z-10 flex items-center justify-center">
              Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
            </span>
            <span className="absolute inset-0 bg-primary/30 animate-pulse"></span>
          </button>
        )}
        
        {(gameState === 'in-progress' && hasCashedOut) || (gameState === 'crashed' && hasCashedOut) ? (
          <div className="bg-game-green/20 text-game-green rounded-lg p-3 text-center animate-fade-in flex items-center justify-center">
            <Zap className="w-4 h-4 mr-2" />
            Cashed out at {currentMultiplier.toFixed(2)}x
          </div>
        ) : (gameState === 'crashed' && isBetting && !hasCashedOut) ? (
          <div className="bg-game-red/20 text-game-red rounded-lg p-3 text-center animate-fade-in flex items-center justify-center">
            <Ban className="w-4 h-4 mr-2" />
            You busted at {currentMultiplier.toFixed(2)}x
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BettingPanel;
