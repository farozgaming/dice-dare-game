
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
    
    // Draw grid lines with gradient effect
    const gridGradient = ctx.createLinearGradient(0, 0, 0, height);
    gridGradient.addColorStop(0, 'rgba(0, 192, 135, 0.05)');
    gridGradient.addColorStop(1, 'rgba(255, 255, 255, 0.01)');
    ctx.strokeStyle = gridGradient;
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
      
      // Create gradient for the path
      const pathGradient = ctx.createLinearGradient(0, height, width, 0);
      pathGradient.addColorStop(0, 'rgba(0, 192, 135, 0.6)');
      pathGradient.addColorStop(1, 'rgba(0, 192, 135, 1)');
      
      // Draw path with gradient fill
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
      
      // Complete the path to create a fillable shape
      ctx.lineTo(x, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      // Fill with gradient
      ctx.fillStyle = 'rgba(0, 192, 135, 0.1)';
      ctx.fill();
      
      // Draw the line itself
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      multiplierHistory.forEach((multiplier, index) => {
        const x = index * xScale;
        const y = height - (multiplier * yScale);
        ctx.lineTo(x, y);
      });
      
      // Add current position
      ctx.lineTo(x, y);
      
      // Style and stroke the path
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4ade80';
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw rocket at the end of path
      const rocketSize = 24;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4); // 45 degrees rotation for upward direction
      
      // Draw rocket body
      const rocketGradient = ctx.createLinearGradient(-rocketSize/2, -rocketSize, rocketSize/2, rocketSize/2);
      rocketGradient.addColorStop(0, '#4ade80');
      rocketGradient.addColorStop(1, '#00C087');
      ctx.fillStyle = rocketGradient;
      
      // Draw a more detailed rocket
      ctx.beginPath();
      ctx.moveTo(0, -rocketSize);
      ctx.lineTo(rocketSize/2, 0);
      ctx.lineTo(rocketSize/4, rocketSize/2);
      ctx.lineTo(-rocketSize/4, rocketSize/2);
      ctx.lineTo(-rocketSize/2, 0);
      ctx.closePath();
      ctx.fill();
      
      // Add rocket details
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(0, -rocketSize/3, rocketSize/6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Draw flame trail behind rocket
      ctx.save();
      const flameGradient = ctx.createRadialGradient(x, y + 5, 0, x, y + 15, 20);
      flameGradient.addColorStop(0, 'rgba(255, 165, 0, 0.9)');
      flameGradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.7)');
      flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      
      // Animated flame size based on multiplier
      const flameSize = 10 + (currentMultiplier % 2) * 5;
      
      // Draw a more dynamic flame
      ctx.moveTo(x, y + 5);
      ctx.quadraticCurveTo(x - 8, y + 15 + flameSize, x - 4, y + 25 + flameSize);
      ctx.quadraticCurveTo(x, y + 20 + flameSize, x + 4, y + 25 + flameSize);
      ctx.quadraticCurveTo(x + 8, y + 15 + flameSize, x, y + 5);
      
      ctx.fill();
      ctx.restore();
      
      // Add particles behind the rocket
      for (let i = 0; i < 5; i++) {
        const particleSize = Math.random() * 3 + 1;
        const distance = Math.random() * 30 + 10;
        const angle = Math.random() * Math.PI - Math.PI/2;
        
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance + 10;
        
        ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 100) + 100}, 0, ${Math.random() * 0.7 + 0.3})`;
        ctx.beginPath();
        ctx.arc(px, py, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw multiplier labels on the chart with better styling
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'right';
    
    const labelSteps = [1, 2, 3, 4, 5];
    labelSteps.forEach(step => {
      const y = height - (step * (height / 5));
      ctx.fillText(`${step}.00x`, 35, y + 4);
    });
    
  }, [gameState, currentMultiplier, multiplierHistory]);
  
  return (
    <div className={`multiplier-container ${gameState}`}>
      {gameState === 'waiting' ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse-opacity">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-primary/5 rounded-full animate-pulse"></div>
            <Timer className="w-16 h-16 text-primary opacity-80 relative z-10" />
          </div>
          <p className="text-lg text-muted-foreground">Next round in</p>
          <p className="text-6xl md:text-8xl font-bold text-white countdown-timer">{countdown}s</p>
        </div>
      ) : gameState === 'crashed' ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-destructive/20 rounded-full animate-pulse"></div>
            <AlertTriangle className="w-16 h-16 text-destructive mb-2 animate-bounce relative z-10" />
          </div>
          <p className="text-xl text-destructive font-medium tracking-wider">CRASHED AT</p>
          <div className="explosion-animation">
            <p className="multiplier text-7xl md:text-9xl font-bold text-destructive text-stroke animate-crash-down shadow-lg">
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
            <Rocket className="w-14 h-14 text-game-green mb-2 rocket-animation" />
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-game-green/20 rounded-full animate-pulse" 
                   style={{ transform: `scale(${1 + (currentMultiplier * 0.05)})` }}></div>
              <p className="multiplier text-7xl md:text-9xl font-bold text-game-green text-stroke relative z-10 shadow-lg">
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
