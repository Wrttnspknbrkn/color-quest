import React from 'react';
import { cn } from '@/lib/utils';

interface GameTileProps {
  color: string;
  onClick: () => void;
}

const colorClasses = {
  blue: 'bg-game-blue',
  pink: 'bg-game-pink',
  yellow: 'bg-game-yellow',
  purple: 'bg-game-purple',
  green: 'bg-game-green',
  orange: 'bg-game-orange',
};

export const GameTile: React.FC<GameTileProps> = ({ color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full aspect-square rounded-lg transition-all duration-200',
        'hover:scale-105 active:scale-95',
        'shadow-md hover:shadow-lg',
        colorClasses[color as keyof typeof colorClasses],
        'focus:outline-none focus:ring-2 focus:ring-white/50'
      )}
      aria-label={`${color} tile`}
    >
      {/* Pattern for colorblind mode - can be toggled later */}
      <div className="w-full h-full flex items-center justify-center">
        <div className={cn(
          'w-1/2 h-1/2 rounded-full border-2 border-white/30',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )} />
      </div>
    </button>
  );
};