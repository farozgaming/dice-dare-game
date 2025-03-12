
import React, { useRef, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Rocket, AlertTriangle, Timer } from 'lucide-react';

const AnimatedMultiplier: React.FC = () => {
  const { gameState, currentMultiplier, countdown, multiplierHistory } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the rocket trajectory
  useEffect(() => {
    if (gameState !== 'in-progress' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let y = height; y >= 0; y -= 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw trajectory
    if (multiplierHistory.length > 1) {
      // Calculate scaling factors to fit chart
      const maxMultiplier = Math.max(currentMultiplier, 2); // At least show up to 2x
      const xScale = width / multiplierHistory.length;
      const yScale = height / maxMultiplier;
      
      // Draw path
      ctx.beginPath();
      ctx.moveTo(0, height); // Start from bottom left
      
      multiplierHistory.forEach((multiplier, index) => {
        const x = index * xScale;
        const y = height - (multiplier * yScale);
        ctx.lineTo(x, y);
      });
      
      // Add current position
      const x = multiplierHistory.length * xScale;
      const y = height - (currentMultiplier * yScale);
      ctx.lineTo(x, y);
      
      // Style and stroke the path
      ctx.strokeStyle = '#4ade80'; // Green color
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4ade80';
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw rocket at the end of path
      const rocketSize = 20;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4); // 45 degrees rotation for upward direction
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.moveTo(0, -rocketSize);
      ctx.lineTo(rocketSize/2, rocketSize/2);
      ctx.lineTo(-rocketSize/2, rocketSize/2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      
      // Draw small trail/flame behind rocket
      ctx.fillStyle = 'rgba(255, 165, 0, 0.7)';
      ctx.beginPath();
      ctx.moveTo(x, y + 5);
      ctx.lineTo(x - 5, y + 15);
      ctx.lineTo(x + 5, y + 15);
      ctx.closePath();
      ctx.fill();
    }
  }, [gameState, currentMultiplier, multiplierHistory]);
  
  return (
    <div className={`multiplier-container ${gameState}`}>
      {gameState === 'waiting' ? (
        <div className="flex flex-col items-center justify-center space-y-3 animate-pulse-opacity">
          <Timer className="w-12 h-12 text-muted-foreground opacity-80" />
          <p className="text-lg text-muted-foreground">Next round in</p>
          <p className="text-5xl md:text-7xl font-bold text-white countdown-timer">{countdown}s</p>
        </div>
      ) : gameState === 'crashed' ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <AlertTriangle className="w-12 h-12 text-game-red mb-2 animate-bounce" />
          <p className="text-lg text-game-red font-medium">CRASHED AT</p>
          <div className="explosion-animation">
            <p className="multiplier text-6xl md:text-8xl font-bold text-game-red text-stroke animate-crash-down">
              {currentMultiplier.toFixed(2)}x
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* Chart canvas */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
            width={800}
            height={500}
          />
          
          {/* Floating multiplier */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-3 z-10">
            <Rocket className="w-12 h-12 text-game-green mb-2 rocket-animation" />
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-game-green/20 rounded-full animate-pulse" 
                   style={{ transform: `scale(${1 + (currentMultiplier * 0.05)})` }}></div>
              <p className="multiplier text-6xl md:text-8xl font-bold text-game-green text-stroke relative z-10">
                {currentMultiplier.toFixed(2)}x
              </p>
            </div>
          </div>
          
          {/* Multiplier labels on y-axis */}
          <div className="absolute top-0 left-2 h-full flex flex-col justify-between text-xs text-muted-foreground opacity-70 py-4">
            <span>5.00x</span>
            <span>4.00x</span>
            <span>3.00x</span>
            <span>2.00x</span>
            <span>1.00x</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedMultiplier;
