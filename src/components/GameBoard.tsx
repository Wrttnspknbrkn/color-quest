import React, { useState, useEffect } from 'react';
import { GameTile } from './GameTile';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { PowerUpButton } from './PowerUpButton';
import { soundManager } from '@/utils/sounds';
import { Volume2, VolumeX } from 'lucide-react';

const BOARD_SIZE = 8;
const COLORS = ['blue', 'pink', 'yellow', 'purple', 'green', 'orange'];
const MIN_MATCH = 3;

export const GameBoard = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [selectedTile, setSelectedTile] = useState<{row: number, col: number} | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();

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
  };

  const checkMatches = (row: number, col: number): { matched: boolean, tiles: Array<[number, number]> } => {
    const color = board[row][col];
    const matches: Array<[number, number]> = [];
    
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

    if (horizontalMatches.length >= MIN_MATCH) {
      matches.push(...horizontalMatches);
    }
    if (verticalMatches.length >= MIN_MATCH) {
      matches.push(...verticalMatches);
    }

    // Remove duplicates
    const uniqueMatches = Array.from(new Set(matches.map(m => JSON.stringify(m))))
      .map(s => JSON.parse(s) as [number, number]);

    return {
      matched: uniqueMatches.length >= MIN_MATCH,
      tiles: uniqueMatches
    };
  };

  const handleMatch = (matches: Array<[number, number]>) => {
    const points = calculatePoints(matches.length);
    setScore(prev => prev + points);

    // Play match sound
    soundManager.playSound('match');

    // Show score animation
    toast({
      title: `+${points} points!`,
      description: matches.length > 3 ? "Great combo!" : "Nice match!",
      duration: 2000,
    });

    // Clear matched tiles and drop new ones
    const newBoard = [...board];
    
    // Clear matched tiles
    matches.forEach(([r, c]) => {
      newBoard[r][c] = '';
    });

    // Drop new tiles
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
      // Fill empty spaces at top with new colors
      for (let row = 0; row < emptySpaces; row++) {
        newBoard[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
    }

    setBoard(newBoard);
  };

  const handleRainbowBlast = () => {
    if (selectedTile) {
      const color = board[selectedTile.row][selectedTile.col];
      const matches: Array<[number, number]> = [];
      
      // Find all tiles of the same color
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
        toast({
          title: "Rainbow Blast!",
          description: `Cleared all ${color} tiles!`,
          duration: 2000,
        });
      }
    } else {
      toast({
        title: "Select a tile first!",
        description: "Click a tile to use Rainbow Blast",
        duration: 2000,
      });
    }
  };

  const toggleMute = () => {
    soundManager.toggleMute();
    setIsMuted(!isMuted);
  };

  const calculatePoints = (matchLength: number): number => {
    // Base points for minimum match (3)
    let points = 100;
    
    // Bonus points for additional matches
    if (matchLength > 3) {
      points += (matchLength - 3) * 50;
    }
    
    return points;
  };

  const handleTileClick = (row: number, col: number) => {
    setSelectedTile({ row, col });
    const { matched, tiles } = checkMatches(row, col);
    
    if (matched) {
      handleMatch(tiles);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4 text-center space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-poppins font-bold text-game-blue">Score: {score}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="ml-2"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </Button>
        </div>
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline"
            onClick={initializeBoard}
            className="bg-white/20 backdrop-blur-sm"
          >
            Reset Game
          </Button>
          <PowerUpButton
            onClick={handleRainbowBlast}
            disabled={!selectedTile}
          />
        </div>
      </div>
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
