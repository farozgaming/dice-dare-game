
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGame } from '@/context/GameContext';
import BetAmount from './BetAmount';

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
    cancelBet
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
    <div className="glass-panel p-6 animate-slide-up">
      <h3 className="text-base font-medium text-white mb-4">Place your bet</h3>
      
      <div className="space-y-6">
        <BetAmount />
        
        <div className="space-y-3">
          <div className="flex items-center">
            <label className="text-sm font-medium text-muted-foreground">Auto Cash Out</label>
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
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Potential profit:</span>
          <span className="font-medium text-white">${(potentialPayout - betAmount).toFixed(2)}</span>
        </div>
        
        {gameState === 'waiting' && !isBetting && (
          <button
            className="bet-action-primary animate-fade-in"
            onClick={placeBet}
            disabled={betAmount <= 0}
          >
            Place Bet
          </button>
        )}
        
        {gameState === 'waiting' && isBetting && (
          <button
            className="bet-action-red animate-fade-in"
            onClick={cancelBet}
          >
            Cancel Bet
          </button>
        )}
        
        {gameState === 'in-progress' && isBetting && !hasCashedOut && (
          <button
            className="bet-action-primary animate-fade-in"
            onClick={cashOut}
          >
            Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
          </button>
        )}
        
        {(gameState === 'in-progress' && hasCashedOut) || (gameState === 'crashed' && hasCashedOut) ? (
          <div className="bg-game-green/20 text-game-green rounded-lg p-3 text-center animate-fade-in">
            Cashed out at {currentMultiplier.toFixed(2)}x
          </div>
        ) : (gameState === 'crashed' && isBetting && !hasCashedOut) ? (
          <div className="bg-game-red/20 text-game-red rounded-lg p-3 text-center animate-fade-in">
            You busted at {currentMultiplier.toFixed(2)}x
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BettingPanel;
