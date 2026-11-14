import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { MAZES } from './data/mazes';
import { GameSaveData, GameScreen, Direction, MazeProgress } from './types/game';
import { sounds } from './audio/soundManager';
import { TitleScreen } from './components/TitleScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { GameHUD } from './components/GameHUD';
import { VictoryModal } from './components/VictoryModal';
import { PauseModal } from './components/PauseModal';
import { VirtualControls } from './components/VirtualControls';

const STORAGE_KEY = 'even_smaller_mazes_save_v1';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // High-level Screen State
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('TITLE');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentMazeId, setCurrentMazeId] = useState<number>(1);
  const [moves, setMoves] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [canUndo, setCanUndo] = useState<boolean>(false);

  // Victory State
  const [victoryData, setVictoryData] = useState<{
    moves: number;
    timeSeconds: number;
    stars: number;
  } | null>(null);

  // Persistent Save State
  const [saveData, setSaveData] = useState<GameSaveData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      mazes: {},
      currentMazeId: 1,
      soundEnabled: true,
      volume: 0.6,
      language: 'pt' // default to Portuguese matching user prompt, toggleable to English
    };
  });

  const activeMaze = MAZES.find(m => m.id === currentMazeId) || MAZES[0];

  // Save to localStorage when saveData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch {
      // Ignore storage errors
    }
  }, [saveData]);

  // Sync sound settings
  useEffect(() => {
    sounds.setEnabled(saveData.soundEnabled);
    sounds.setVolume(saveData.volume);
  }, [saveData.soundEnabled, saveData.volume]);

  // Timer loop when playing
  useEffect(() => {
    if (currentScreen !== 'PLAYING' || isPaused || victoryData) return;
    const interval = setInterval(() => {
      setTimeSeconds(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentScreen, isPaused, victoryData]);

  // Handle Canvas resize
  const updateCanvasSize = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.parentElement?.getBoundingClientRect();
    if (rect) {
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // Victory callback from engine
  const handleVictory = useCallback((finalMoves: number, finalTime: number) => {
    let stars = 1;
    if (finalMoves <= activeMaze.parMoves) {
      stars = 3;
    } else if (finalMoves <= Math.ceil(activeMaze.parMoves * 1.5)) {
      stars = 2;
    }

    const prevBestMoves = saveData.mazes[activeMaze.id]?.bestMoves;
    const prevBestTime = saveData.mazes[activeMaze.id]?.bestTimeSeconds;
    const prevStars = saveData.mazes[activeMaze.id]?.stars || 0;

    const newProgress: MazeProgress = {
      completed: true,
      bestMoves: prevBestMoves ? Math.min(prevBestMoves, finalMoves) : finalMoves,
      bestTimeSeconds: prevBestTime ? Math.min(prevBestTime, finalTime) : finalTime,
      stars: Math.max(prevStars, stars)
    };

    setSaveData(prev => ({
      ...prev,
      mazes: {
        ...prev.mazes,
        [activeMaze.id]: newProgress
      }
    }));

    setVictoryData({
      moves: finalMoves,
      timeSeconds: finalTime,
      stars
    });
  }, [activeMaze.id, activeMaze.parMoves, saveData.mazes]);

  // Initialize or update Engine when maze or canvas changes
  useEffect(() => {
    if (currentScreen !== 'PLAYING' || !canvasRef.current) return;

    updateCanvasSize();

    if (!engineRef.current) {
      engineRef.current = new GameEngine(canvasRef.current, activeMaze);
    } else {
      engineRef.current.setMaze(activeMaze);
    }

    engineRef.current.setCallbacks(
      (newMoves) => {
        setMoves(newMoves);
        setCanUndo(newMoves > 0);
      },
      handleVictory
    );

    engineRef.current.start();
    setTimeSeconds(0);
    setMoves(0);
    setCanUndo(false);
    setVictoryData(null);
    setShowHint(false);

    return () => {
      engineRef.current?.stop();
    };
  }, [currentScreen, activeMaze, handleVictory, updateCanvasSize]);

  // Controls Handlers
  const handleMove = useCallback((dir: Direction) => {
    if (currentScreen !== 'PLAYING' || isPaused || victoryData) return;
    engineRef.current?.tryMove(dir);
  }, [currentScreen, isPaused, victoryData]);

  const handleAction = useCallback(() => {
    if (currentScreen !== 'PLAYING' || isPaused || victoryData) return;
    engineRef.current?.executeAction();
  }, [currentScreen, isPaused, victoryData]);

  const handleUndo = useCallback(() => {
    if (currentScreen !== 'PLAYING' || isPaused || victoryData) return;
    const success = engineRef.current?.undo();
    if (success) {
      setMoves(m => Math.max(0, m - 1));
    }
  }, [currentScreen, isPaused, victoryData]);

  const handleRestart = useCallback(() => {
    if (currentScreen !== 'PLAYING') return;
    engineRef.current?.resetMaze();
    setMoves(0);
    setTimeSeconds(0);
    setCanUndo(false);
    setVictoryData(null);
    setIsPaused(false);
    sounds.playGateUnlock();
  }, [currentScreen]);

  const handleToggleSound = useCallback(() => {
    setSaveData(prev => {
      const next = !prev.soundEnabled;
      sounds.setEnabled(next);
      return { ...prev, soundEnabled: next };
    });
  }, []);

  const handleChangeVolume = useCallback((vol: number) => {
    setSaveData(prev => {
      sounds.setVolume(vol);
      return { ...prev, volume: vol };
    });
  }, []);

  const handleToggleLanguage = useCallback(() => {
    setSaveData(prev => ({
      ...prev,
      language: prev.language === 'pt' ? 'en' : 'pt'
    }));
  }, []);

  const handleSelectMaze = useCallback((id: number) => {
    setCurrentMazeId(id);
    setSaveData(prev => ({ ...prev, currentMazeId: id }));
    setCurrentScreen('PLAYING');
    setIsPaused(false);
  }, []);

  const handleNextMaze = useCallback(() => {
    const nextId = currentMazeId < 32 ? currentMazeId + 1 : 1;
    handleSelectMaze(nextId);
  }, [currentMazeId, handleSelectMaze]);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear held keys / prevent defaults
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Title Screen Start
      if (currentScreen === 'TITLE') {
        if (e.key === 'Enter' || e.key === ' ') {
          setCurrentScreen('PLAYING');
          sounds.playMove();
        }
        return;
      }

      // Gallery Escape
      if (currentScreen === 'GALLERY') {
        if (e.key === 'Escape') {
          setCurrentScreen('TITLE');
        }
        return;
      }

      // In Playing Screen
      if (currentScreen === 'PLAYING') {
        if (e.key === 'Escape') {
          if (victoryData) {
            handleNextMaze();
          } else {
            setIsPaused(p => !p);
          }
          return;
        }

        if (isPaused) return;

        if (victoryData) {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNextMaze();
          }
          return;
        }

        switch (e.code) {
          case 'ArrowUp':
          case 'KeyW':
            handleMove('up');
            break;
          case 'ArrowDown':
          case 'KeyS':
            handleMove('down');
            break;
          case 'ArrowLeft':
          case 'KeyA':
            handleMove('left');
            break;
          case 'ArrowRight':
          case 'KeyD':
            handleMove('right');
            break;
          case 'Space':
          case 'KeyE':
            handleAction();
            break;
          case 'KeyZ':
          case 'Backspace':
            handleUndo();
            break;
          case 'KeyR':
            handleRestart();
            break;
          case 'KeyM':
            handleToggleSound();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentScreen,
    isPaused,
    victoryData,
    handleMove,
    handleAction,
    handleUndo,
    handleRestart,
    handleToggleSound,
    handleNextMaze
  ]);

  const completedCount = Object.values(saveData.mazes).filter(m => m.completed).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0e12] select-none">
      {/* 1. Title Screen */}
      {currentScreen === 'TITLE' && (
        <TitleScreen
          onStart={() => {
            setCurrentScreen('PLAYING');
            sounds.playMove();
          }}
          onOpenGallery={() => setCurrentScreen('GALLERY')}
          soundEnabled={saveData.soundEnabled}
          onToggleSound={handleToggleSound}
          language={saveData.language}
          onToggleLanguage={handleToggleLanguage}
          completedCount={completedCount}
        />
      )}

      {/* 2. Gallery / Level Select Workbench */}
      {currentScreen === 'GALLERY' && (
        <GalleryScreen
          saveData={saveData}
          language={saveData.language}
          onSelectMaze={handleSelectMaze}
          onBack={() => setCurrentScreen('TITLE')}
        />
      )}

      {/* 3. Active Playing Canvas & Low-Occlusion HUD */}
      {currentScreen === 'PLAYING' && (
        <div className="relative w-full h-full">
          {/* Isolated Canvas Container */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none"
          />

          {/* Minimal Perimeter HUD */}
          <GameHUD
            maze={activeMaze}
            moves={moves}
            timeSeconds={timeSeconds}
            soundEnabled={saveData.soundEnabled}
            language={saveData.language}
            showHint={showHint}
            onToggleHint={() => setShowHint(h => !h)}
            onUndo={handleUndo}
            onRestart={handleRestart}
            onToggleSound={handleToggleSound}
            onOpenMenu={() => setIsPaused(true)}
            onActionClick={handleAction}
            canUndo={canUndo}
          />

          {/* Virtual Controls for Mobile & Touch */}
          <VirtualControls
            onMove={handleMove}
            onAction={handleAction}
            showActionButton={['laser_mirror', 'echo_ghost', 'magnetic_polarity', 'origami_stamp', 'teleport_beacon'].includes(activeMaze.mechanicRule)}
          />

          {/* Pause Modal */}
          {isPaused && (
            <PauseModal
              language={saveData.language}
              soundEnabled={saveData.soundEnabled}
              volume={saveData.volume}
              onResume={() => setIsPaused(false)}
              onRestart={handleRestart}
              onGallery={() => {
                setIsPaused(false);
                setCurrentScreen('GALLERY');
              }}
              onToggleSound={handleToggleSound}
              onChangeVolume={handleChangeVolume}
              onToggleLanguage={handleToggleLanguage}
            />
          )}

          {/* Victory Modal */}
          {victoryData && (
            <VictoryModal
              maze={activeMaze}
              moves={victoryData.moves}
              timeSeconds={victoryData.timeSeconds}
              stars={victoryData.stars}
              language={saveData.language}
              onNext={handleNextMaze}
              onReplay={handleRestart}
              onGallery={() => setCurrentScreen('GALLERY')}
              isLastMaze={currentMazeId === 32}
            />
          )}
        </div>
      )}
    </div>
  );
}
