import React, { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Trophy } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (score: number) => boolean;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'score_100',
    title: 'Beginner\'s Luck',
    description: 'Score your first 100 points',
    condition: (score) => score >= 100,
    unlocked: false,
  },
  {
    id: 'score_500',
    title: 'Color Master',
    description: 'Reach 500 points',
    condition: (score) => score >= 500,
    unlocked: false,
  },
  {
    id: 'rainbow_unlock',
    title: 'Rainbow Power',
    description: 'Unlock the Rainbow Blast power-up!',
    condition: (score) => score >= 400,
    unlocked: false,
  },
  {
    id: 'score_1000',
    title: 'Rainbow Champion',
    description: 'Achieve 1000 points',
    condition: (score) => score >= 1000,
    unlocked: false,
  },
  {
    id: 'diagonal_master',
    title: 'Diagonal Master',
    description: 'Clear a diagonal line of tiles',
    condition: (score) => score >= 300,
    unlocked: false,
  }
];

const MOTIVATIONAL_PHRASES = [
  "Great job matching those colors!",
  "You're becoming a color matching expert!",
  "Keep up the fantastic work!",
  "Your color coordination is amazing!",
  "You're making the world more colorful!",
];

export const useAchievements = (score: number) => {
  useEffect(() => {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievements.includes(achievement.id) && achievement.condition(score)) {
        // Unlock new achievement
        achievements.push(achievement.id);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // Show achievement notification
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.title}: ${achievement.description}`,
          duration: 5000,
        });
      }
    });
  }, [score]);

  const showMotivationalPhrase = () => {
    const randomPhrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
    toast({
      title: "✨ Keep Going!",
      description: randomPhrase,
      duration: 3000,
    });
  };

  const isRainbowBlastUnlocked = () => {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    return achievements.includes('rainbow_unlock');
  };

  return { showMotivationalPhrase, isRainbowBlastUnlocked };
};
