import React from 'react';
import { Button } from './ui/button';
import { PowerUpButton } from './PowerUpButton';

interface GameControlsProps {
  onReset: () => void;
  onRainbowBlast: () => void;
  isRainbowBlastDisabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  onRainbowBlast,
  isRainbowBlastDisabled,
}) => {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <Button 
        variant="outline"
        onClick={onReset}
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
      >
        Reset Game
      </Button>
      <PowerUpButton
        onClick={onRainbowBlast}
        disabled={isRainbowBlastDisabled}
      />
    </div>
  );
};