import React, { useState, useEffect } from 'react';
import { GameTile } from './GameTile';
import { useToast } from '@/hooks/use-toast';

const BOARD_SIZE = 8;
const COLORS = ['blue', 'pink', 'yellow', 'purple', 'green', 'orange'];

export const GameBoard = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
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
  };

  const handleTileClick = (row: number, col: number) => {
    // TODO: Implement matching logic
    const color = board[row][col];
    toast({
      title: "Tile Selected",
      description: `Selected ${color} tile at position (${row}, ${col})`,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-poppins font-bold text-game-blue">Score: {score}</h2>
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