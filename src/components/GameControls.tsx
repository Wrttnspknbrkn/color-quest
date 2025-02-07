
import React from 'react';
import { Button } from './ui/button';
import { PowerUpButton } from './PowerUpButton';
import { useAchievements } from './AchievementSystem';
import { Progress } from './ui/progress';

interface GameControlsProps {
  onReset: () => void;
  onRainbowBlast: () => void;
  isRainbowBlastDisabled: boolean;
  score: number;
  powerUpProgress: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  onRainbowBlast,
  isRainbowBlastDisabled,
  score,
  powerUpProgress,
}) => {
  const { isRainbowBlastUnlocked } = useAchievements(score);
  const rainbowUnlocked = isRainbowBlastUnlocked();

  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="flex justify-center gap-4">
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
      {rainbowUnlocked && (
        <div className="w-full max-w-xs">
          <Progress 
            value={powerUpProgress * 100} 
            className="h-2 bg-white/20"
          />
          <p className="text-center text-sm text-white/70 mt-1">
            Rainbow Power Progress
          </p>
        </div>
      )}
    </div>
  );
};
