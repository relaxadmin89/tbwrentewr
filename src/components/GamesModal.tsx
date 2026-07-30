import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Gamepad2, 
  RotateCcw, 
  Trophy, 
  Play, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Code,
  Terminal,
  Cpu,
  Database,
  Zap,
  Shield,
  Flame,
  Sparkles,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
  theme: 'light' | 'dark';
}

// Memory game icons
const MEMORY_ICONS = [
  { id: 'code', Icon: Code, color: 'text-blue-500' },
  { id: 'terminal', Icon: Terminal, color: 'text-emerald-500' },
  { id: 'cpu', Icon: Cpu, color: 'text-purple-500' },
  { id: 'database', Icon: Database, color: 'text-amber-500' },
  { id: 'zap', Icon: Zap, color: 'text-yellow-500' },
  { id: 'shield', Icon: Shield, color: 'text-indigo-500' },
  { id: 'flame', Icon: Flame, color: 'text-rose-500' },
  { id: 'sparkles', Icon: Sparkles, color: 'text-cyan-500' },
];

/* =========================================================================
   1. CYBER SNAKE GAME
   ========================================================================= */
const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }];
const INITIAL_DIR = 'UP';

const CyberSnake: React.FC<{ lang: 'ru' | 'en'; theme: 'light' | 'dark' }> = ({ lang, theme }) => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<string>(INITIAL_DIR);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 3, y: 3 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake_highscore') || '0', 10);
  });

  const dirRef = useRef(direction);
  dirRef.current = direction;

  const spawnFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newX: number, newY: number;
    while (true) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      const onSnake = currentSnake.some(seg => seg.x === newX && seg.y === newY);
      if (!onSnake) break;
    }
    return { x: newX, y: newY };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIR);
    dirRef.current = INITIAL_DIR;
    setFood(spawnFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      const key = e.key;
      const currentDir = dirRef.current;

      if ((key === 'ArrowUp' || key === 'w' || key === 'W') && currentDir !== 'DOWN') {
        e.preventDefault();
        setDirection('UP');
      } else if ((key === 'ArrowDown' || key === 's' || key === 'S') && currentDir !== 'UP') {
        e.preventDefault();
        setDirection('DOWN');
      } else if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && currentDir !== 'RIGHT') {
        e.preventDefault();
        setDirection('LEFT');
      } else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && currentDir !== 'LEFT') {
        e.preventDefault();
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const timer = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const curDir = dirRef.current;

        if (curDir === 'UP') head.y -= 1;
        if (curDir === 'DOWN') head.y += 1;
        if (curDir === 'LEFT') head.x -= 1;
        if (curDir === 'RIGHT') head.x += 1;

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore.toString());
          }
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 140);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, food, score, highScore, spawnFood]);

  const changeDir = (newDir: string) => {
    const cur = dirRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') setDirection('UP');
    if (newDir === 'DOWN' && cur !== 'UP') setDirection('DOWN');
    if (newDir === 'LEFT' && cur !== 'RIGHT') setDirection('LEFT');
    if (newDir === 'RIGHT' && cur !== 'LEFT') setDirection('RIGHT');
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-between w-full max-w-xs font-mono text-xs px-2">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-emerald-500">SCORE:</span>
          <span>{score}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
          <Trophy size={14} />
          <span>BEST: {highScore}</span>
        </div>
      </div>

      <div 
        className={`relative w-72 h-72 rounded-2xl border p-1 grid grid-cols-15 grid-rows-15 gap-[1px] shadow-lg transition-colors ${
          theme === 'dark' 
            ? 'bg-neutral-950 border-neutral-800 shadow-emerald-950/20' 
            : 'bg-neutral-100 border-neutral-300 shadow-neutral-200'
        }`}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              className={`rounded-[2px] transition-all duration-75 ${
                isHead 
                  ? 'bg-emerald-400 scale-105 shadow-sm shadow-emerald-400/50' 
                  : isBody 
                  ? 'bg-emerald-600/80 dark:bg-emerald-500/80' 
                  : isFood 
                  ? 'bg-rose-500 animate-pulse rounded-full scale-110 shadow-sm shadow-rose-500/50' 
                  : theme === 'dark' 
                  ? 'bg-neutral-900/40' 
                  : 'bg-white/60'
              }`}
            />
          );
        })}

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-3 z-10">
            {isGameOver ? (
              <>
                <p className="text-rose-400 font-mono text-sm font-bold tracking-widest uppercase">
                  {lang === 'ru' ? 'ИГРА ОКОНЧЕНА' : 'GAME OVER'}
                </p>
                <p className="text-neutral-300 font-mono text-xs">
                  {lang === 'ru' ? `Счет: ${score}` : `Final Score: ${score}`}
                </p>
                <button
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-mono text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  <RotateCcw size={14} />
                  {lang === 'ru' ? 'ИГРАТЬ СНОВА' : 'PLAY AGAIN'}
                </button>
              </>
            ) : (
              <>
                <p className="text-neutral-200 font-mono text-sm font-bold tracking-wider">
                  {lang === 'ru' ? 'КЛАССИЧЕСКАЯ ЗМЕЙКА' : 'CYBER SNAKE'}
                </p>
                <p className="text-neutral-400 font-mono text-[11px] max-w-[200px]">
                  {lang === 'ru' ? 'Управление клавишами W,A,S,D или кнопками' : 'Use WASD / Arrow keys or buttons'}
                </p>
                <button
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-mono text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95"
                >
                  <Play size={14} fill="currentColor" />
                  {lang === 'ru' ? 'НАЧАТЬ ИГРУ' : 'START GAME'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* D-Pad */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => changeDir('UP')}
          disabled={!isPlaying || isGameOver}
          className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
        >
          <ArrowUp size={14} />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDir('LEFT')}
            disabled={!isPlaying || isGameOver}
            className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => changeDir('DOWN')}
            disabled={!isPlaying || isGameOver}
            className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={() => changeDir('RIGHT')}
            disabled={!isPlaying || isGameOver}
            className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. MEMORY MATCH GAME
   ========================================================================= */
interface CardItem {
  uid: number;
  iconId: string;
}

const MemoryMatch: React.FC<{ lang: 'ru' | 'en'; theme: 'light' | 'dark' }> = ({ lang, theme }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const initDeck = useCallback(() => {
    const deck: CardItem[] = [];
    let idCounter = 0;
    MEMORY_ICONS.forEach(icon => {
      deck.push({ uid: idCounter++, iconId: icon.id });
      deck.push({ uid: idCounter++, iconId: icon.id });
    });
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
    setIsBusy(false);
  }, []);

  useEffect(() => {
    initDeck();
  }, [initDeck]);

  const handleCardClick = (idx: number) => {
    if (isBusy || flipped.includes(idx) || matched.includes(cards[idx].iconId)) {
      return;
    }

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsBusy(true);

      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.iconId === secondCard.iconId) {
        const newMatched = [...matched, firstCard.iconId];
        setMatched(newMatched);
        setFlipped([]);
        setIsBusy(false);

        if (newMatched.length === MEMORY_ICONS.length) {
          setIsWon(true);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsBusy(false);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-between w-full max-w-xs font-mono text-xs px-2">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-cyan-500">{lang === 'ru' ? 'ХОДЫ:' : 'MOVES:'}</span>
          <span>{moves}</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
          <span className="text-emerald-500">{lang === 'ru' ? 'ПАРЫ:' : 'PAIRS:'}</span>
          <span>{matched.length} / {MEMORY_ICONS.length}</span>
        </div>
        <button
          onClick={initDeck}
          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          title={lang === 'ru' ? 'Перезапустить' : 'Restart'}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5 w-72 h-72 relative">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.iconId);
          const iconObj = MEMORY_ICONS.find(i => i.id === card.iconId);
          const IconComp = iconObj ? iconObj.Icon : Code;
          const iconColor = iconObj ? iconObj.color : 'text-neutral-400';

          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              className={`relative rounded-xl border flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-sm ${
                isFlipped
                  ? theme === 'dark'
                    ? 'bg-neutral-900 border-neutral-700 rotate-0'
                    : 'bg-white border-neutral-300 rotate-0 shadow-md'
                  : theme === 'dark'
                  ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-600'
                  : 'bg-neutral-100 border-neutral-200/80 hover:border-neutral-400 text-neutral-400'
              }`}
            >
              {isFlipped ? (
                <IconComp className={`w-6 h-6 ${iconColor} transition-all scale-100`} />
              ) : (
                <span className="font-mono text-xs font-bold opacity-40">?</span>
              )}
            </button>
          );
        })}

        {isWon && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-3 z-10">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 animate-bounce">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-emerald-400 font-mono text-sm font-bold tracking-widest uppercase">
              {lang === 'ru' ? 'ОТЛИЧНАЯ ПАМЯТЬ!' : 'VICTORY!'}
            </p>
            <p className="text-neutral-300 font-mono text-xs">
              {lang === 'ru' ? `Победа за ${moves} ходов` : `Completed in ${moves} moves`}
            </p>
            <button
              onClick={initDeck}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-mono text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              <RotateCcw size={14} />
              {lang === 'ru' ? 'ЕЩЕ РАЗ' : 'PLAY AGAIN'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   3. CYBER 2048 GAME
   ========================================================================= */
type Board2048 = number[][];

const createEmptyBoard = (): Board2048 => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const getTileColor = (val: number, theme: 'light' | 'dark') => {
  switch (val) {
    case 2: return 'bg-neutral-800 text-neutral-200 border-neutral-700';
    case 4: return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
    case 8: return 'bg-cyan-950 text-cyan-300 border-cyan-700/60';
    case 16: return 'bg-blue-950 text-blue-300 border-blue-700/60';
    case 32: return 'bg-violet-950 text-violet-300 border-violet-700/60';
    case 64: return 'bg-purple-950 text-purple-300 border-purple-700/60';
    case 128: return 'bg-amber-950 text-amber-300 border-amber-700/60 shadow-sm shadow-amber-500/20';
    case 256: return 'bg-rose-950 text-rose-300 border-rose-700/60 shadow-sm shadow-rose-500/20';
    case 512: return 'bg-red-900 text-red-200 border-red-500 shadow-md shadow-red-500/30';
    case 1024: return 'bg-amber-500 text-neutral-950 font-extrabold shadow-lg shadow-amber-400/50';
    case 2048: return 'bg-emerald-400 text-neutral-950 font-extrabold shadow-xl shadow-emerald-400/60 animate-pulse';
    default: return 'bg-indigo-600 text-white font-extrabold';
  }
};

const Cyber2048: React.FC<{ lang: 'ru' | 'en'; theme: 'light' | 'dark' }> = ({ lang, theme }) => {
  const [board, setBoard] = useState<Board2048>(createEmptyBoard);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('2048_highscore') || '0', 10);
  });
  const [isGameOver, setIsGameOver] = useState(false);

  const addRandomTile = useCallback((b: Board2048): Board2048 => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return b;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = b.map(row => [...row]);
    newBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }, []);

  const resetGame = useCallback(() => {
    let newB = createEmptyBoard();
    newB = addRandomTile(newB);
    newB = addRandomTile(newB);
    setBoard(newB);
    setScore(0);
    setIsGameOver(false);
  }, [addRandomTile]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const checkGameOver = (b: Board2048) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) return false;
        if (c < 3 && b[r][c] === b[r][c + 1]) return false;
        if (r < 3 && b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  };

  const move = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (isGameOver) return;

    let pointsEarned = 0;
    let moved = false;

    const rotateLeft = (b: Board2048): Board2048 => {
      const res = createEmptyBoard();
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          res[3 - c][r] = b[r][c];
        }
      }
      return res;
    };

    let tempBoard = board.map(row => [...row]);

    // Rotate board to treat all moves as LEFT
    let rotations = 0;
    if (dir === 'UP') rotations = 1;
    if (dir === 'RIGHT') rotations = 2;
    if (dir === 'DOWN') rotations = 3;

    for (let i = 0; i < rotations; i++) {
      tempBoard = rotateLeft(tempBoard);
    }

    // Slide and merge left
    for (let r = 0; r < 4; r++) {
      let row = tempBoard[r].filter(val => val !== 0);
      let mergedRow: number[] = [];
      let i = 0;
      while (i < row.length) {
        if (i < row.length - 1 && row[i] === row[i + 1]) {
          const mergedVal = row[i] * 2;
          mergedRow.push(mergedVal);
          pointsEarned += mergedVal;
          i += 2;
        } else {
          mergedRow.push(row[i]);
          i += 1;
        }
      }
      while (mergedRow.length < 4) mergedRow.push(0);

      for (let c = 0; c < 4; c++) {
        if (tempBoard[r][c] !== mergedRow[c]) moved = true;
        tempBoard[r][c] = mergedRow[c];
      }
    }

    // Rotate back
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      tempBoard = rotateLeft(tempBoard);
    }

    if (moved) {
      const newBoardWithTile = addRandomTile(tempBoard);
      const newScore = score + pointsEarned;
      setBoard(newBoardWithTile);
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('2048_highscore', newScore.toString());
      }

      if (checkGameOver(newBoardWithTile)) {
        setIsGameOver(true);
      }
    }
  }, [board, isGameOver, score, highScore, addRandomTile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); move('UP'); }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); move('DOWN'); }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); move('LEFT'); }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); move('RIGHT'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-between w-full max-w-xs font-mono text-xs px-2">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-cyan-500">SCORE:</span>
          <span>{score}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
          <Trophy size={14} />
          <span>BEST: {highScore}</span>
        </div>
        <button
          onClick={resetGame}
          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className={`relative w-72 h-72 rounded-2xl border p-2 grid grid-cols-4 grid-rows-4 gap-2 shadow-lg ${
        theme === 'dark' ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
      }`}>
        {board.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-xl border flex items-center justify-center font-mono font-bold transition-all duration-150 ${
                val === 0 
                  ? theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800/40' : 'bg-white/60 border-neutral-200/50'
                  : `${getTileColor(val, theme)} text-sm ${val > 100 ? 'text-xs' : ''}`
              }`}
            >
              {val > 0 ? val : ''}
            </div>
          ))
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-3 z-10">
            <p className="text-rose-400 font-mono text-sm font-bold tracking-widest uppercase">
              {lang === 'ru' ? 'НЕТ HОДОВ!' : 'NO MORE MOVES'}
            </p>
            <p className="text-neutral-300 font-mono text-xs">
              {lang === 'ru' ? `Финальный счет: ${score}` : `Final Score: ${score}`}
            </p>
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-mono text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              <RotateCcw size={14} />
              {lang === 'ru' ? 'СНАЧАЛА' : 'RETRY'}
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => move('UP')}
          className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
        >
          <ArrowUp size={14} />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => move('LEFT')}
            className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => move('DOWN')}
            className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={() => move('RIGHT')}
            className="p-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl transition-all active:scale-90"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. CYBER ARKANOID (BRICK BREAKER)
   ========================================================================= */
const CyberArkanoid: React.FC<{ lang: 'ru' | 'en'; theme: 'light' | 'dark' }> = ({ lang, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('IDLE');

  // Game references for smooth loop
  const stateRef = useRef({
    paddleX: 110,
    paddleWidth: 60,
    paddleHeight: 10,
    ballX: 140,
    ballY: 220,
    ballDx: 2.5,
    ballDy: -2.5,
    ballRadius: 5,
    bricks: [] as { x: number; y: number; w: number; h: number; active: boolean; color: string }[],
    score: 0,
    lives: 3,
  });

  const initBricks = () => {
    const rows = 4;
    const cols = 6;
    const brickWidth = 40;
    const brickHeight = 12;
    const padding = 5;
    const offsetTop = 20;
    const offsetLeft = 8;

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b'];
    const newBricks = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newBricks.push({
          x: offsetLeft + c * (brickWidth + padding),
          y: offsetTop + r * (brickHeight + padding),
          w: brickWidth,
          h: brickHeight,
          active: true,
          color: colors[r % colors.length],
        });
      }
    }
    return newBricks;
  };

  const startGame = () => {
    stateRef.current = {
      paddleX: 110,
      paddleWidth: 60,
      paddleHeight: 10,
      ballX: 140,
      ballY: 220,
      ballDx: (Math.random() > 0.5 ? 1 : -1) * 2.5,
      ballDy: -2.5,
      ballRadius: 5,
      bricks: initBricks(),
      score: 0,
      lives: 3,
    };
    setScore(0);
    setLives(3);
    setGameState('PLAYING');
  };

  // Keyboard controls
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const st = stateRef.current;

      // Move Paddle
      if (keysRef.current.left && st.paddleX > 0) {
        st.paddleX -= 5;
      }
      if (keysRef.current.right && st.paddleX < canvas.width - st.paddleWidth) {
        st.paddleX += 5;
      }

      // Move Ball
      st.ballX += st.ballDx;
      st.ballY += st.ballDy;

      // Wall Collisions
      if (st.ballX - st.ballRadius < 0 || st.ballX + st.ballRadius > canvas.width) {
        st.ballDx = -st.ballDx;
      }
      if (st.ballY - st.ballRadius < 0) {
        st.ballDy = -st.ballDy;
      }

      // Paddle Collision
      if (
        st.ballY + st.ballRadius >= canvas.height - 20 &&
        st.ballY - st.ballRadius <= canvas.height - 10 &&
        st.ballX >= st.paddleX &&
        st.ballX <= st.paddleX + st.paddleWidth
      ) {
        // Change angle depending on where it hit paddle
        const hitPoint = (st.ballX - (st.paddleX + st.paddleWidth / 2)) / (st.paddleWidth / 2);
        st.ballDx = hitPoint * 3.5;
        st.ballDy = -Math.abs(st.ballDy);
      }

      // Bottom Wall (Lose Life)
      if (st.ballY + st.ballRadius > canvas.height) {
        st.lives -= 1;
        setLives(st.lives);
        if (st.lives <= 0) {
          setGameState('GAMEOVER');
          return;
        } else {
          // Reset ball position
          st.ballX = 140;
          st.ballY = 220;
          st.ballDx = (Math.random() > 0.5 ? 1 : -1) * 2.5;
          st.ballDy = -2.5;
        }
      }

      // Brick Collisions
      let activeCount = 0;
      st.bricks.forEach(b => {
        if (!b.active) return;
        activeCount++;
        if (
          st.ballX + st.ballRadius > b.x &&
          st.ballX - st.ballRadius < b.x + b.w &&
          st.ballY + st.ballRadius > b.y &&
          st.ballY - st.ballRadius < b.y + b.h
        ) {
          b.active = false;
          st.ballDy = -st.ballDy;
          st.score += 20;
          setScore(st.score);
        }
      });

      if (activeCount === 0) {
        setGameState('VICTORY');
        return;
      }

      // DRAWING
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Bricks
      st.bricks.forEach(b => {
        if (!b.active) return;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 3);
        ctx.fill();
      });

      // Draw Paddle
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(st.paddleX, canvas.height - 20, st.paddleWidth, st.paddleHeight, 5);
      ctx.fill();

      // Draw Ball
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(st.ballX, st.ballY, st.ballRadius, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  // Touch / Drag handler for Mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const st = stateRef.current;
    st.paddleX = Math.max(0, Math.min(canvas.width - st.paddleWidth, touchX - st.paddleWidth / 2));
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-between w-full max-w-xs font-mono text-xs px-2">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-emerald-500">SCORE:</span>
          <span>{score}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-rose-500">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} size={14} fill={i < lives ? 'currentColor' : 'none'} className={i < lives ? 'text-rose-500' : 'text-neutral-600'} />
          ))}
        </div>
      </div>

      <div className="relative w-72 h-72 rounded-2xl border bg-neutral-950 border-neutral-800 shadow-lg overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onTouchMove={handleTouchMove}
          className="w-[280px] h-[280px] touch-none cursor-pointer"
        />

        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-3 z-10">
            {gameState === 'GAMEOVER' && (
              <>
                <p className="text-rose-400 font-mono text-sm font-bold tracking-widest uppercase">
                  {lang === 'ru' ? 'ИГРА ОКОНЧЕНА' : 'GAME OVER'}
                </p>
                <p className="text-neutral-300 font-mono text-xs">
                  {lang === 'ru' ? `Счет: ${score}` : `Final Score: ${score}`}
                </p>
              </>
            )}
            {gameState === 'VICTORY' && (
              <>
                <p className="text-emerald-400 font-mono text-sm font-bold tracking-widest uppercase">
                  {lang === 'ru' ? 'ПОБЕДА!' : 'VICTORY!'}
                </p>
                <p className="text-neutral-300 font-mono text-xs">
                  {lang === 'ru' ? `Все блоки разбиты! Счет: ${score}` : `All bricks destroyed! Score: ${score}`}
                </p>
              </>
            )}
            {gameState === 'IDLE' && (
              <>
                <p className="text-neutral-200 font-mono text-sm font-bold tracking-wider">
                  {lang === 'ru' ? 'НЕОНОВЫЙ АРКАНОИД' : 'CYBER ARKANOID'}
                </p>
                <p className="text-neutral-400 font-mono text-[11px] max-w-[200px]">
                  {lang === 'ru' ? 'Управляйте платформой стрелочками или пальцем' : 'Control paddle with arrows or touch drag'}
                </p>
              </>
            )}
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-mono text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Play size={14} fill="currentColor" />
              {gameState === 'IDLE' 
                ? (lang === 'ru' ? 'НАЧАТЬ ИГРУ' : 'START GAME')
                : (lang === 'ru' ? 'ЕЩЕ РАЗ' : 'PLAY AGAIN')}
            </button>
          </div>
        )}
      </div>

      {/* Manual buttons for paddle */}
      <div className="flex items-center gap-4 pt-1">
        <button
          onMouseDown={() => (keysRef.current.left = true)}
          onMouseUp={() => (keysRef.current.left = false)}
          onTouchStart={() => (keysRef.current.left = true)}
          onTouchEnd={() => (keysRef.current.left = false)}
          disabled={gameState !== 'PLAYING'}
          className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold rounded-xl transition-all active:scale-95"
        >
          ◄ {lang === 'ru' ? 'ЛЕВО' : 'LEFT'}
        </button>
        <button
          onMouseDown={() => (keysRef.current.right = true)}
          onMouseUp={() => (keysRef.current.right = false)}
          onTouchStart={() => (keysRef.current.right = true)}
          onTouchEnd={() => (keysRef.current.right = false)}
          disabled={gameState !== 'PLAYING'}
          className="px-6 py-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold rounded-xl transition-all active:scale-95"
        >
          {lang === 'ru' ? 'ПРАВО' : 'RIGHT'} ►
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   MAIN GAMES MODAL COMPONENT
   ========================================================================= */
export const GamesModal: React.FC<GamesModalProps> = ({ isOpen, onClose, lang, theme }) => {
  const [activeTab, setActiveTab] = useState<'snake' | 'memory' | '2048' | 'arkanoid'>('snake');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl shadow-emerald-950/30 p-6 overflow-hidden"
        >
          {/* Top Neon Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-rose-500" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                <Gamepad2 size={20} />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold tracking-wider uppercase text-neutral-100 flex items-center gap-2">
                  <span>{lang === 'ru' ? 'Мини-Игры' : 'Mini-Games'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono">
                  {lang === 'ru' ? 'Выбирайте любую из 4 аркад' : 'Choose from 4 retro arcades'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Game Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 my-3.5 p-1 rounded-xl bg-neutral-900/90 border border-neutral-800">
            <button
              onClick={() => setActiveTab('snake')}
              className={`py-2 px-2 rounded-lg font-mono text-[11px] font-bold transition-all text-center border ${
                activeTab === 'snake'
                  ? 'bg-neutral-800 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-950/50'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              🐍 {lang === 'ru' ? 'Змейка' : 'Snake'}
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`py-2 px-2 rounded-lg font-mono text-[11px] font-bold transition-all text-center border ${
                activeTab === 'memory'
                  ? 'bg-neutral-800 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              🧠 {lang === 'ru' ? 'Память' : 'Memory'}
            </button>
            <button
              onClick={() => setActiveTab('2048')}
              className={`py-2 px-2 rounded-lg font-mono text-[11px] font-bold transition-all text-center border ${
                activeTab === '2048'
                  ? 'bg-neutral-800 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-950/50'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              🔢 2048
            </button>
            <button
              onClick={() => setActiveTab('arkanoid')}
              className={`py-2 px-2 rounded-lg font-mono text-[11px] font-bold transition-all text-center border ${
                activeTab === 'arkanoid'
                  ? 'bg-neutral-800 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-950/50'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              🧱 {lang === 'ru' ? 'Арканоид' : 'Arkanoid'}
            </button>
          </div>

          {/* Active Game Container */}
          <div className="py-1">
            {activeTab === 'snake' && <CyberSnake lang={lang} theme={theme} />}
            {activeTab === 'memory' && <MemoryMatch lang={lang} theme={theme} />}
            {activeTab === '2048' && <Cyber2048 lang={lang} theme={theme} />}
            {activeTab === 'arkanoid' && <CyberArkanoid lang={lang} theme={theme} />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
