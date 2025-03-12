
import React from 'react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="w-full h-16 bg-game-dark border-b border-gray-800 px-6 flex items-center justify-between animate-slide-down">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-white mr-8">CrashGame</h1>
        <nav className="hidden md:flex space-x-6">
          <a 
            href="#" 
            className="text-white hover:text-primary transition-colors duration-200"
          >
            Home
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-white transition-colors duration-200"
          >
            Games
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-white transition-colors duration-200"
          >
            Leaderboard
          </a>
          <a 
            href="#" 
            className="text-muted-foreground hover:text-white transition-colors duration-200"
          >
            Support
          </a>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          Sign In
        </Button>
        <Button 
          className="bg-primary text-white hover:bg-primary/90 transition-all duration-200"
        >
          Register
        </Button>
      </div>
    </header>
  );
};

export default Header;
