import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PowerUpButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const PowerUpButton: React.FC<PowerUpButtonProps> = ({ onClick, disabled, className }) => {
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'bg-gradient-to-r from-game-pink to-game-purple text-white',
        'hover:opacity-90 transition-all duration-200',
        'flex items-center gap-2',
        'disabled:opacity-50',
        className
      )}
    >
      <Sparkles className="w-4 h-4" />
      Rainbow Blast
    </Button>
  );
};