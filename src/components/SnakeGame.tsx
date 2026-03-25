import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20; // px
const INITIAL_SPEED = 150; // ms

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
    gameAreaRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (hasStarted) {
          setIsPaused((p) => !p);
        } else {
          resetGame();
        }
        return;
      }

      if (isPaused) return;

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    },
    [gameOver, isPaused, hasStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
          setSpeed((s) => Math.max(50, s - 2)); // Increase speed slightly
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, hasStarted, food, speed, generateFood]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-4 px-2">
        <div className="text-fuchsia-500 font-mono text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-cyan-500 font-mono text-sm uppercase tracking-widest flex items-center">
          {isPaused && hasStarted && !gameOver ? 'PAUSED' : ''}
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="relative bg-black/60 border-2 border-fuchsia-500/50 rounded-lg shadow-[0_0_30px_rgba(217,70,239,0.2)] overflow-hidden outline-none"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
        tabIndex={0}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #d946ef 1px, transparent 1px), linear-gradient(to bottom, #d946ef 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute rounded-sm ${
                isHead 
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] z-10' 
                  : 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.8)]'
              }`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                margin: 1,
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,1)] animate-pulse"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            margin: 1,
          }}
        />

        {/* Overlays */}
        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {gameOver ? (
              <>
                <h2 className="text-red-500 text-4xl font-black mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest">GAME OVER</h2>
                <p className="text-fuchsia-400 font-mono mb-6 text-lg">FINAL SCORE: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all rounded"
                >
                  Play Again
                </button>
              </>
            ) : (
              <>
                <h2 className="text-cyan-400 text-4xl font-black mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] tracking-widest text-center">NEON<br/>SNAKE</h2>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-transparent border-2 border-fuchsia-500 text-fuchsia-400 font-bold uppercase tracking-widest hover:bg-fuchsia-500 hover:text-black hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all rounded"
                >
                  Start Game
                </button>
                <p className="text-gray-500 text-xs mt-6 font-mono">Use Arrow Keys or WASD to move</p>
                <p className="text-gray-500 text-xs mt-1 font-mono">Space to pause</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
