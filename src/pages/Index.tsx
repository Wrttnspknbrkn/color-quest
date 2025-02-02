import { GameBoard } from '@/components/GameBoard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-game-blue/20 via-game-pink/20 to-game-yellow/20">
      <div className="container py-8">
        <h1 className="text-4xl md:text-6xl font-poppins font-bold text-center mb-8 text-game-blue">
          Color Quest
        </h1>
        <GameBoard />
      </div>
    </div>
  );
};

export default Index;