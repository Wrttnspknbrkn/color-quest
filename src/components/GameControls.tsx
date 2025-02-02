import React from 'react';
import { Button } from './ui/button';
import { PowerUpButton } from './PowerUpButton';
import { useAchievements } from './AchievementSystem';

interface GameControlsProps {
  onReset: () => void;
  onRainbowBlast: () => void;
  isRainbowBlastDisabled: boolean;
  score: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  onRainbowBlast,
  isRainbowBlastDisabled,
  score,
}) => {
  const { isRainbowBlastUnlocked } = useAchievements(score);
  const rainbowUnlocked = isRainbowBlastUnlocked();

  return (
    <div className="flex justify-center gap-4 mb-4">
      <Button 
        variant="outline"
        onClick={onReset}
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
      >
        Reset Game
      </Button>
      {rainbowUnlocked && (
        <PowerUpButton
          onClick={onRainbowBlast}
          disabled={isRainbowBlastDisabled}
        />
      )}
    </div>
  );
};