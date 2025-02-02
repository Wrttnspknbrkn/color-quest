import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

interface GameHeaderProps {
  score: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ score, isMuted, onToggleMute }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-poppins font-bold text-game-blue animate-fade-in">
        Score: {score}
      </h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        className="ml-2 hover:bg-white/20 transition-colors"
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};