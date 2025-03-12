
import React, { createContext, useContext, useState, useEffect } from 'react';

export type GameState = 'waiting' | 'in-progress' | 'crashed';

export interface BetHistory {
  id: number;
  multiplier: number;
  crashed: boolean;
}

interface GameContextProps {
  gameState: GameState;
  currentMultiplier: number;
  countdown: number;
  betAmount: number;
  autoCashoutAt: number;
  betHistory: BetHistory[];
  isBetting: boolean;
  hasCashedOut: boolean;
  setGameState: (state: GameState) => void;
  setBetAmount: (amount: number) => void;
  setAutoCashoutAt: (value: number) => void;
  placeBet: () => void;
  cashOut: () => void;
  cancelBet: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [countdown, setCountdown] = useState<number>(5);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [autoCashoutAt, setAutoCashoutAt] = useState<number>(2);
  const [isBetting, setIsBetting] = useState<boolean>(false);
  const [hasCashedOut, setHasCashedOut] = useState<boolean>(false);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([
    { id: 1, multiplier: 1.24, crashed: false },
    { id: 2, multiplier: 3.81, crashed: false },
    { id: 3, multiplier: 1.06, crashed: true },
    { id: 4, multiplier: 2.46, crashed: false },
    { id: 5, multiplier: 1.94, crashed: false },
    { id: 6, multiplier: 1.12, crashed: true },
    { id: 7, multiplier: 5.63, crashed: false },
    { id: 8, multiplier: 1.37, crashed: false },
  ]);

  // Game loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameState === 'waiting') {
      // Countdown phase
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setGameState('in-progress');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'in-progress') {
      // Game running, increase multiplier
      interval = setInterval(() => {
        setCurrentMultiplier((prev) => {
          const increase = Math.random() * 0.03 + 0.01;
          const newValue = parseFloat((prev + increase).toFixed(2));
          
          // Auto cashout if betting
          if (isBetting && !hasCashedOut && newValue >= autoCashoutAt) {
            cashOut();
          }
          
          // Random crash logic
          if (Math.random() < 0.02 || newValue > 10) {
            clearInterval(interval!);
            
            // If still betting, mark as loss
            if (isBetting && !hasCashedOut) {
              setHasCashedOut(false);
            }
            
            setGameState('crashed');
            
            // Add to history
            setBetHistory((prev) => [
              { id: Date.now(), multiplier: newValue, crashed: true },
              ...prev.slice(0, 19)
            ]);
            
            // Reset after short delay
            setTimeout(() => {
              setGameState('waiting');
              setCurrentMultiplier(1.00);
              setCountdown(5);
              setIsBetting(false);
              setHasCashedOut(false);
            }, 3000);
            
            return newValue;
          }
          
          return newValue;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, isBetting, hasCashedOut, autoCashoutAt]);

  const placeBet = () => {
    if (gameState === 'waiting') {
      setIsBetting(true);
      setHasCashedOut(false);
    }
  };

  const cashOut = () => {
    if (gameState === 'in-progress' && isBetting && !hasCashedOut) {
      setHasCashedOut(true);
      
      // Add to history
      setBetHistory((prev) => [
        { id: Date.now(), multiplier: currentMultiplier, crashed: false },
        ...prev.slice(0, 19)
      ]);
    }
  };

  const cancelBet = () => {
    if (gameState === 'waiting') {
      setIsBetting(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentMultiplier,
        countdown,
        betAmount,
        autoCashoutAt,
        betHistory,
        isBetting,
        hasCashedOut,
        setGameState,
        setBetAmount,
        setAutoCashoutAt,
        placeBet,
        cashOut,
        cancelBet,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
