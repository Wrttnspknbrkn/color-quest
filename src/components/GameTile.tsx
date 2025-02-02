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
  '': 'bg-transparent',
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
        'focus:outline-none focus:ring-2 focus:ring-white/50',
        'relative overflow-hidden',
        'animate-tile-pop', // Pop animation on appear
        color === '' && 'animate-tile-fade', // Fade animation for clearing
        'after:content-[""] after:absolute after:inset-0',
        'after:bg-white/20 after:opacity-0 after:transition-opacity',
        'hover:after:opacity-100',
        // Particle effects
        'before:content-[""] before:absolute before:inset-0',
        'before:bg-[radial-gradient(circle,_var(--tw-gradient-stops))]',
        'before:from-white/40 before:to-transparent',
        'before:scale-0 before:opacity-0',
        'before:transition-all before:duration-300',
        'active:before:scale-100 active:before:opacity-100',
      )}
      aria-label={`${color} tile`}
      disabled={color === ''}
    >
      {/* Pattern for colorblind mode */}
      <div className={cn(
        'w-full h-full flex items-center justify-center',
        'opacity-0 group-hover:opacity-100 transition-opacity'
      )}>
        <div className={cn(
          'w-1/2 h-1/2 rounded-full border-2 border-white/30',
        )} />
      </div>
    </button>
  );
};