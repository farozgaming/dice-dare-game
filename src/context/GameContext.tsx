import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

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
  userBalance: number;
  streakCount: number;
  multiplierHistory: number[];
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
  const [userBalance, setUserBalance] = useState<number>(1250.00);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [multiplierHistory, setMultiplierHistory] = useState<number[]>([]);
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

  const getCrashProbability = () => {
    const baseMultiplierFactor = Math.pow(currentMultiplier, 1.5) * 0.01;
    const streakFactor = Math.min(streakCount * 0.008, 0.05);
    const randomFactor = Math.random() * 0.02;
    const houseEdge = currentMultiplier > 3 ? 0.03 : 0.01;
    return Math.min(baseMultiplierFactor + streakFactor + randomFactor + houseEdge, 0.12);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameState === 'waiting') {
      setMultiplierHistory([]);
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
      interval = setInterval(() => {
        setCurrentMultiplier((prev) => {
          const speedFactor = Math.max(0.9 - (Math.log(prev) * 0.1), 0.3);
          const increase = (Math.random() * 0.02 + 0.01) * speedFactor;
          const newValue = parseFloat((prev + increase).toFixed(2));
          
          setMultiplierHistory(history => [...history, newValue]);
          
          if (isBetting && !hasCashedOut && newValue >= autoCashoutAt) {
            cashOut();
          }
          
          if (Math.random() < getCrashProbability() || newValue > 20) {
            clearInterval(interval!);
            
            if (isBetting && !hasCashedOut) {
              setHasCashedOut(false);
              setStreakCount(0);
              
              toast({
                title: "Busted!",
                description: `The game crashed at ${newValue.toFixed(2)}x`,
                variant: "destructive"
              });
            }
            
            setGameState('crashed');
            
            setBetHistory((prev) => [
              { id: Date.now(), multiplier: newValue, crashed: true },
              ...prev.slice(0, 19)
            ]);
            
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
  }, [gameState, isBetting, hasCashedOut, autoCashoutAt, streakCount]);

  const placeBet = () => {
    if (gameState === 'waiting' && betAmount > 0 && betAmount <= userBalance) {
      setIsBetting(true);
      setHasCashedOut(false);
      setUserBalance(prev => prev - betAmount);
      
      toast({
        title: "Bet Placed",
        description: `$${betAmount.toFixed(2)} bet placed with auto-cashout at ${autoCashoutAt}x`,
      });
    } else if (betAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this bet",
        variant: "destructive"
      });
    }
  };

  const cashOut = () => {
    if (gameState === 'in-progress' && isBetting && !hasCashedOut) {
      setHasCashedOut(true);
      
      const winnings = betAmount * currentMultiplier;
      setUserBalance(prev => prev + winnings);
      
      setStreakCount(prev => prev + 1);
      
      toast({
        title: "Cash Out Successful!",
        description: `You won $${(winnings - betAmount).toFixed(2)} at ${currentMultiplier.toFixed(2)}x`,
        variant: "default"
      });
      
      setBetHistory((prev) => [
        { id: Date.now(), multiplier: currentMultiplier, crashed: false },
        ...prev.slice(0, 19)
      ]);
    }
  };

  const cancelBet = () => {
    if (gameState === 'waiting') {
      setIsBetting(false);
      setUserBalance(prev => prev + betAmount);
      
      toast({
        title: "Bet Cancelled",
        description: "Your bet has been cancelled",
      });
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
        userBalance,
        streakCount,
        multiplierHistory,
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
