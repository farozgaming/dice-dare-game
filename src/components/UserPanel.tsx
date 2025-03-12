
import React from 'react';

const UserPanel: React.FC = () => {
  // Dummy user data - in a real app, this would come from user context/API
  const userData = {
    balance: 1250.00,
    username: 'Player123',
    level: 12,
    wager: 4850.00,
  };
  
  return (
    <div className="glass-panel p-6 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-white">My Account</h3>
        <span className="text-muted-foreground text-sm">Level {userData.level}</span>
      </div>
      
      <div className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Balance</div>
          <div className="text-xl font-bold text-white">${userData.balance.toFixed(2)}</div>
        </div>
        
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Username</div>
            <div className="font-medium text-white">{userData.username}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Total Wager</div>
            <div className="font-medium text-white">${userData.wager.toFixed(2)}</div>
          </div>
        </div>
        
        <button className="w-full py-2.5 rounded-lg bg-muted hover:bg-muted/70 text-white transition-all duration-200">
          Deposit
        </button>
      </div>
    </div>
  );
};

export default UserPanel;
