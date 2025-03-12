
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGame } from '@/context/GameContext';

const BetAmount: React.FC = () => {
  const { betAmount, setBetAmount, gameState, isBetting } = useGame();
  
  const presets = [5, 10, 50, 100, 500];
  
  const handleSetBetAmount = (amount: number) => {
    if (gameState === 'waiting' && !isBetting) {
      setBetAmount(amount);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === 'waiting' && !isBetting) {
      const value = parseFloat(e.target.value);
      if (!isNaN(value) && value >= 0) {
        setBetAmount(value);
      }
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <label className="text-sm font-medium text-muted-foreground">Bet Amount</label>
      </div>
      
      <Input
        type="number"
        value={betAmount}
        onChange={handleInputChange}
        className="game-input w-full"
        min="1"
        step="1"
        disabled={gameState !== 'waiting' || isBetting}
      />
      
      <div className="grid grid-cols-5 gap-2">
        {presets.map((amount) => (
          <Button
            key={amount}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSetBetAmount(amount)}
            disabled={gameState !== 'waiting' || isBetting}
            className="h-8 text-xs bg-muted hover:bg-muted/80 transition-colors duration-200"
          >
            ${amount}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BetAmount;
