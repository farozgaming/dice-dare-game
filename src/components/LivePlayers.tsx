
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Users } from 'lucide-react';

// Mock data for live players
const mockPlayers = [
  { id: 1, name: 'CryptoKing', amount: 25, multiplier: 2.5, cashed: true },
  { id: 2, name: 'LuckyDragon', amount: 100, multiplier: 0, cashed: false },
  { id: 3, name: 'BitMaster', amount: 50, multiplier: 0, cashed: false },
  { id: 4, name: 'RocketMan', amount: 75, multiplier: 1.5, cashed: true },
  { id: 5, name: 'MoonShot', amount: 200, multiplier: 0, cashed: false },
];

const LivePlayers: React.FC = () => {
  const { gameState, currentMultiplier } = useGame();
  const [players, setPlayers] = React.useState(mockPlayers);
  
  // Simulate other players cashing out
  React.useEffect(() => {
    if (gameState === 'in-progress') {
      const interval = setInterval(() => {
        setPlayers(prev => 
          prev.map(player => {
            // If player hasn't cashed out yet, randomly decide to cash out
            if (!player.cashed && Math.random() < 0.1) {
              return { ...player, multiplier: currentMultiplier, cashed: true };
            }
            return player;
          })
        );
      }, 500);
      
      return () => clearInterval(interval);
    } else if (gameState === 'waiting') {
      // Reset players for next round
      setPlayers(mockPlayers.map(p => ({ ...p, multiplier: 0, cashed: false })));
    }
  }, [gameState, currentMultiplier]);
  
  return (
    <div className="glass-panel p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Live Players</h3>
      </div>
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-none">
        {players.map((player) => (
          <div 
            key={player.id}
            className={`flex items-center justify-between p-2 text-xs rounded 
                      ${player.cashed ? 'bg-game-green/10 text-white' : 
                        gameState === 'crashed' && !player.cashed ? 'bg-game-red/10 text-white' : 
                        'bg-white/5 text-muted-foreground'}`}
          >
            <div className="font-medium">{player.name}</div>
            <div className="flex items-center gap-3">
              <div>${player.amount.toFixed(2)}</div>
              {player.cashed ? (
                <div className="bg-game-green/20 text-game-green px-2 py-0.5 rounded">
                  {player.multiplier.toFixed(2)}x
                </div>
              ) : gameState === 'crashed' && !player.cashed ? (
                <div className="bg-game-red/20 text-game-red px-2 py-0.5 rounded">
                  BUST
                </div>
              ) : (
                <div className="bg-white/10 px-2 py-0.5 rounded animate-pulse">
                  Waiting...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePlayers;
