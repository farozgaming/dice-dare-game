
import React from 'react';
import Header from '@/components/Header';
import CrashGame from '@/components/CrashGame';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-game-dark">
      <Header />
      <main className="flex-1 py-6">
        <CrashGame />
      </main>
    </div>
  );
};

export default Index;
