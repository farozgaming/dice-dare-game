
import React, { useRef, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Rocket, AlertTriangle, Timer, TrendingUp, Users, DollarSign, Award } from 'lucide-react';

const AnimatedMultiplier: React.FC = () => {
  const { gameState, currentMultiplier, countdown, multiplierHistory } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the rocket trajectory
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth * 2; // For high DPI displays
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
    
    // Set up dimensions
    const width = canvas.width / 2;
    const height = canvas.height / 2;
    
    // Draw grid with dark background
    const gridColor = 'rgba(255, 255, 255, 0.05)';
    
    // Add a dark translucent background
    ctx.fillStyle = 'rgba(10, 10, 15, 0.7)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw horizontal grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Create gradient for y-axis
    const yAxisGradient = ctx.createLinearGradient(0, 0, 0, height);
    yAxisGradient.addColorStop(0, 'rgba(0, 192, 135, 0.1)');
    yAxisGradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    
    ctx.fillStyle = yAxisGradient;
    ctx.fillRect(0, 0, 40, height);
    
    // Horizontal grid lines
    for (let y = height; y >= 0; y -= 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    if (gameState === 'in-progress' && multiplierHistory.length > 1) {
      // Calculate scaling factors to fit chart
      const maxMultiplier = Math.max(currentMultiplier, 2); // At least show up to 2x
      const xScale = (width - 50) / 100; // Show last 100 points, or all points if less
      const yScale = (height - 20) / maxMultiplier;
      
      const historyToShow = multiplierHistory.slice(-100); // Show last 100 points
      
      // Create gradient for the path
      const pathGradient = ctx.createLinearGradient(0, height, width, 0);
      pathGradient.addColorStop(0, 'rgba(0, 192, 135, 0.2)');
      pathGradient.addColorStop(0.5, 'rgba(0, 255, 180, 0.3)');
      pathGradient.addColorStop(1, 'rgba(100, 255, 218, 0.4)');
      
      // Draw path with gradient fill
      ctx.beginPath();
      ctx.moveTo(50, height - 20); // Start from bottom left with padding
      
      historyToShow.forEach((multiplier, index) => {
        const x = 50 + index * xScale;
        const y = height - 20 - (multiplier * yScale);
        ctx.lineTo(x, y);
      });
      
      // Add current position
      const x = 50 + historyToShow.length * xScale;
      const y = height - 20 - (currentMultiplier * yScale);
      ctx.lineTo(x, y);
      
      // Complete the path to create a fillable shape
      ctx.lineTo(x, height - 20);
      ctx.lineTo(50, height - 20);
      ctx.closePath();
      
      // Fill with gradient
      ctx.fillStyle = pathGradient;
      ctx.fill();
      
      // Draw the trajectory line itself with glow effect
      ctx.beginPath();
      ctx.moveTo(50, height - 20);
      
      historyToShow.forEach((multiplier, index) => {
        const x = 50 + index * xScale;
        const y = height - 20 - (multiplier * yScale);
        ctx.lineTo(x, y);
      });
      
      // Add current position
      ctx.lineTo(x, y);
      
      // Apply fancy line styling
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#4ade80';
      ctx.stroke();
      
      // Add glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#4ade80';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff9d';
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw rocket at the end
      const drawRocket = () => {
        const rocketSize = 24;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4); // 45 degrees rotation for upward direction
        
        // Create gradient for rocket body
        const rocketGradient = ctx.createLinearGradient(-rocketSize/2, -rocketSize, rocketSize/2, rocketSize/2);
        rocketGradient.addColorStop(0, '#4ade80');
        rocketGradient.addColorStop(1, '#00C087');
        ctx.fillStyle = rocketGradient;
        
        // Rocket body
        ctx.beginPath();
        ctx.moveTo(0, -rocketSize);
        ctx.lineTo(rocketSize/2, 0);
        ctx.lineTo(rocketSize/4, rocketSize/2);
        ctx.lineTo(-rocketSize/4, rocketSize/2);
        ctx.lineTo(-rocketSize/2, 0);
        ctx.closePath();
        ctx.fill();
        
        // Rocket window
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(0, -rocketSize/3, rocketSize/6, 0, Math.PI * 2);
        ctx.fill();
        
        // Add rocket edge highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
        
        // Draw flame trail
        ctx.save();
        const flameGradient = ctx.createRadialGradient(x, y + 5, 0, x, y + 15, 20);
        flameGradient.addColorStop(0, 'rgba(255, 165, 0, 0.9)');
        flameGradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.7)');
        flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.fillStyle = flameGradient;
        
        // Animated flame size based on multiplier
        const flameSize = 10 + (currentMultiplier % 2) * 5;
        
        // Draw dynamic flame
        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.quadraticCurveTo(x - 8, y + 15 + flameSize, x - 4, y + 25 + flameSize);
        ctx.quadraticCurveTo(x, y + 20 + flameSize, x + 4, y + 25 + flameSize);
        ctx.quadraticCurveTo(x + 8, y + 15 + flameSize, x, y + 5);
        ctx.fill();
        
        // Add glow to flame
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 165, 0, 0.7)';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
        
        // Add particles behind the rocket
        for (let i = 0; i < 8; i++) {
          const particleSize = Math.random() * 4 + 1;
          const distance = Math.random() * 40 + 10;
          const angle = Math.random() * Math.PI - Math.PI/2;
          
          const px = x + Math.cos(angle) * distance;
          const py = y + Math.sin(angle) * distance + 10;
          
          // Create gradient for particles
          const particleGradient = ctx.createRadialGradient(px, py, 0, px, py, particleSize);
          particleGradient.addColorStop(0, `rgba(255, ${Math.floor(Math.random() * 100) + 155}, 50, ${Math.random() * 0.5 + 0.5})`);
          particleGradient.addColorStop(1, `rgba(255, ${Math.floor(Math.random() * 50) + 100}, 0, 0)`);
          
          ctx.fillStyle = particleGradient;
          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow to particles
          ctx.shadowBlur = 5;
          ctx.shadowColor = `rgba(255, 165, 0, 0.5)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      };
      
      drawRocket();
      
      // Draw multiplier labels on y-axis
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'left';
      
      // Calculate step size based on max multiplier
      const stepSize = maxMultiplier <= 5 ? 1 : Math.ceil(maxMultiplier / 5);
      for (let step = 0; step <= maxMultiplier; step += stepSize) {
        const y = height - 20 - (step * yScale);
        ctx.fillText(`${step.toFixed(1)}x`, 5, y + 4);
        
        // Highlight horizontal line at each label
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Bottom axis labels (time)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('Time', width/2, height - 5);
    }
    
  }, [gameState, currentMultiplier, multiplierHistory]);
  
  return (
    <div className={`multiplier-container ${gameState} w-full h-full`}>
      {gameState === 'waiting' ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse-opacity z-10 relative">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse"></div>
            <Timer className="w-16 h-16 text-primary opacity-90 relative z-10" />
          </div>
          <p className="text-lg text-white/80">Next round starts in</p>
          <p className="text-6xl md:text-8xl font-bold text-white countdown-timer">{countdown}s</p>
          <div className="mt-4 flex items-center space-x-2 text-white/60 bg-white/5 px-4 py-2 rounded-full">
            <TrendingUp size={16} />
            <span>Place your bets for the next round</span>
          </div>
        </div>
      ) : gameState === 'crashed' ? (
        <div className="flex flex-col items-center justify-center space-y-3 z-10 relative">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-destructive/30 rounded-full animate-pulse"></div>
            <AlertTriangle className="w-16 h-16 text-destructive mb-2 animate-bounce relative z-10" />
          </div>
          <p className="text-xl text-destructive font-bold tracking-wider bg-destructive/10 px-6 py-1 rounded-full border border-destructive/20">CRASHED AT</p>
          <div className="explosion-animation">
            <p className="multiplier text-7xl md:text-9xl font-bold text-destructive text-stroke animate-crash-down shadow-lg">
              {currentMultiplier.toFixed(2)}x
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-3 text-white/60">
            <div className="flex items-center space-x-1 bg-white/5 px-3 py-1 rounded-full">
              <Users size={14} />
              <span>142 players lost</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/5 px-3 py-1 rounded-full">
              <DollarSign size={14} />
              <span>$21,348 washed</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/5 px-3 py-1 rounded-full">
              <Award size={14} />
              <span>32 cashed out</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* Chart canvas */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />
          
          {/* Floating multiplier */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-3 z-10">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-game-green/20 rounded-full animate-pulse" 
                   style={{ transform: `scale(${1 + (currentMultiplier * 0.08)})` }}></div>
              <p className="multiplier text-7xl md:text-9xl font-bold text-game-green text-stroke relative z-10 shadow-lg">
                {currentMultiplier.toFixed(2)}x
              </p>
            </div>
          </div>
          
          {/* Game stats overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-white/90">LIVE</span>
              </div>
              <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs border border-white/10">
                <span className="text-white/90">Round #2451</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-white/10">
                <Users size={12} />
                <span className="text-white/90">Players: 142</span>
              </div>
              <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-white/10">
                <DollarSign size={12} />
                <span className="text-white/90">Total Bets: $12,458</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedMultiplier;
