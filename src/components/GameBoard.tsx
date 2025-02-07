
import React, { useState, useEffect } from 'react';
import { GameTile } from './GameTile';
import { useToast } from '@/hooks/use-toast';
import { GameHeader } from './GameHeader';
import { GameControls } from './GameControls';
import { useAchievements } from './AchievementSystem';
import { soundManager } from '@/utils/sounds';

const BOARD_SIZE = 8;
const COLORS = ['blue', 'pink', 'yellow', 'purple', 'green', 'orange'];
const MIN_MATCH = 3;
const POWER_UP_THRESHOLD = 400;

export const GameBoard = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [selectedTile, setSelectedTile] = useState<{row: number, col: number} | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [lastPowerUpScore, setLastPowerUpScore] = useState(0);
  const { toast } = useToast();
  const { showMotivationalPhrase } = useAchievements(score);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill(null).map(() =>
      Array(BOARD_SIZE).fill(null).map(() =>
        COLORS[Math.floor(Math.random() * COLORS.length)]
      )
    );
    setBoard(newBoard);
    setScore(0);
    setLastPowerUpScore(0);
  };

  const handleMatch = (matches: Array<[number, number]>) => {
    const points = calculatePoints(matches.length);
    setScore(prev => prev + points);
    soundManager.playSound('match');
    showMotivationalPhrase();

    // Show combo messages for larger matches
    if (matches.length > 4) {
      toast({
        title: "🌟 Amazing Combo!",
        description: `You matched ${matches.length} tiles!`,
        duration: 2000,
      });
    }

    const newBoard = [...board];
    matches.forEach(([r, c]) => {
      newBoard[r][c] = '';
    });

    setTimeout(() => {
      for (let col = 0; col < BOARD_SIZE; col++) {
        let emptySpaces = 0;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
          if (newBoard[row][col] === '') {
            emptySpaces++;
          } else if (emptySpaces > 0) {
            newBoard[row + emptySpaces][col] = newBoard[row][col];
            newBoard[row][col] = '';
          }
        }
        for (let row = 0; row < emptySpaces; row++) {
          newBoard[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }
      setBoard(newBoard);
      soundManager.playSound('land');
    }, 300);
  };

  const handleRainbowBlast = () => {
    if (selectedTile && canUsePowerUp()) {
      const color = board[selectedTile.row][selectedTile.col];
      const matches: Array<[number, number]> = [];
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (board[row][col] === color) {
            matches.push([row, col]);
          }
        }
      }

      if (matches.length > 0) {
        soundManager.playSound('powerup');
        handleMatch(matches);
        setLastPowerUpScore(score);
        toast({
          title: "🌈 Rainbow Blast Used!",
          description: "Make another 400 points to use it again!",
          duration: 3000,
        });
      }
    }
  };

  const canUsePowerUp = () => {
    return score - lastPowerUpScore >= POWER_UP_THRESHOLD;
  };

  const toggleMute = () => {
    soundManager.toggleMute();
    setIsMuted(!isMuted);
  };

  const calculatePoints = (matchLength: number): number => {
    let points = 100;
    // Bonus points for larger matches
    if (matchLength > 3) {
      points += (matchLength - 3) * 75; // Increased bonus points
    }
    return points;
  };

  const checkDiagonalMatches = (row: number, col: number, color: string): Array<[number, number]> => {
    const matches: Array<[number, number]> = [[row, col]];
    
    // Check diagonal up-right and down-left
    let upRight: Array<[number, number]> = [];
    let downLeft: Array<[number, number]> = [];
    
    // Up-right
    let r = row - 1;
    let c = col + 1;
    while (r >= 0 && c < BOARD_SIZE && board[r][c] === color) {
      upRight.push([r, c]);
      r--;
      c++;
    }
    
    // Down-left
    r = row + 1;
    c = col - 1;
    while (r < BOARD_SIZE && c >= 0 && board[r][c] === color) {
      downLeft.push([r, c]);
      r++;
      c--;
    }
    
    // Check diagonal up-left and down-right
    let upLeft: Array<[number, number]> = [];
    let downRight: Array<[number, number]> = [];
    
    // Up-left
    r = row - 1;
    c = col - 1;
    while (r >= 0 && c >= 0 && board[r][c] === color) {
      upLeft.push([r, c]);
      r--;
      c--;
    }
    
    // Down-right
    r = row + 1;
    c = col + 1;
    while (r < BOARD_SIZE && c < BOARD_SIZE && board[r][c] === color) {
      downRight.push([r, c]);
      r++;
      c++;
    }
    
    // Check if either diagonal has enough matches
    if (upRight.length + downLeft.length + 1 >= MIN_MATCH) {
      matches.push(...upRight, ...downLeft);
    }
    if (upLeft.length + downRight.length + 1 >= MIN_MATCH) {
      matches.push(...upLeft, ...downRight);
    }
    
    return matches;
  };

  const handleTileClick = (row: number, col: number) => {
    setSelectedTile({ row, col });
    const { matched, tiles } = checkMatches(row, col);
    
    if (matched) {
      handleMatch(tiles);
    }
  };

  const checkMatches = (row: number, col: number): { matched: boolean, tiles: Array<[number, number]> } => {
    const color = board[row][col];
    const matches = new Set<string>();
    
    // Check horizontal matches
    let horizontalMatches: Array<[number, number]> = [[row, col]];
    // Check left
    for (let i = col - 1; i >= 0 && board[row][i] === color; i--) {
      horizontalMatches.push([row, i]);
    }
    // Check right
    for (let i = col + 1; i < BOARD_SIZE && board[row][i] === color; i++) {
      horizontalMatches.push([row, i]);
    }

    // Check vertical matches
    let verticalMatches: Array<[number, number]> = [[row, col]];
    // Check up
    for (let i = row - 1; i >= 0 && board[i][col] === color; i--) {
      verticalMatches.push([i, col]);
    }
    // Check down
    for (let i = row + 1; i < BOARD_SIZE && board[i][col] === color; i++) {
      verticalMatches.push([i, col]);
    }

    // Get diagonal matches
    const diagonalMatches = checkDiagonalMatches(row, col, color);

    // Add all matches to the Set to remove duplicates
    [...horizontalMatches, ...verticalMatches, ...diagonalMatches].forEach(match => {
      matches.add(JSON.stringify(match));
    });

    // Convert back to array of tuples
    const uniqueMatches = Array.from(matches).map(s => JSON.parse(s) as [number, number]);

    return {
      matched: uniqueMatches.length >= MIN_MATCH,
      tiles: uniqueMatches
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <GameHeader
        score={score}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />
      <GameControls
        onReset={initializeBoard}
        onRainbowBlast={handleRainbowBlast}
        isRainbowBlastDisabled={!selectedTile || !canUsePowerUp()}
        score={score}
        powerUpProgress={(score - lastPowerUpScore) / POWER_UP_THRESHOLD}
      />
      <div className="grid grid-cols-8 gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-2 shadow-xl">
        {board.map((row, rowIndex) => (
          row.map((color, colIndex) => (
            <GameTile
              key={`${rowIndex}-${colIndex}`}
              color={color}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            />
          ))
        ))}
      </div>
    </div>
  );
};
