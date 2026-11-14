import React from 'react';
import { RotateCcw, Undo2, Volume2, VolumeX, Menu, Lightbulb, Play } from 'lucide-react';
import { MazeConfig, Language } from '../types/game';

interface GameHUDProps {
  maze: MazeConfig;
  moves: number;
  timeSeconds: number;
  soundEnabled: boolean;
  language: Language;
  showHint: boolean;
  onToggleHint: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onOpenMenu: () => void;
  onActionClick: () => void;
  canUndo: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  maze,
  moves,
  timeSeconds,
  soundEnabled,
  language,
  showHint,
  onToggleHint,
  onUndo,
  onRestart,
  onToggleSound,
  onOpenMenu,
  onActionClick,
  canUndo
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  const actionLabel = React.useMemo(() => {
    switch (maze.mechanicRule) {
      case 'laser_mirror':
        return language === 'pt' ? 'Girar Espelho' : 'Rotate Mirror';
      case 'echo_ghost':
        return language === 'pt' ? 'Soltar Fantasma' : 'Play Echo';
      case 'magnetic_polarity':
        return language === 'pt' ? 'Inverter Polo (+/-)' : 'Flip Polarity (+/-)';
      case 'origami_stamp':
        return language === 'pt' ? 'Virar Selo' : 'Flip Stamp';
      case 'teleport_beacon':
        return language === 'pt' ? 'Baliza / Teleporte' : 'Beacon / Warp';
      default:
        return null;
    }
  }, [maze.mechanicRule, language]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-20 select-none">
      {/* Top Status Bar: Perimeter Clusters */}
      <div className="w-full flex items-start justify-between gap-4">
        {/* Top-Left: Maze Info */}
        <div className="pointer-events-auto flex flex-col gap-1 max-w-xs md:max-w-md">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="font-bold text-amber-400">
              #{String(maze.id).padStart(2, '0')} / 32
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
              maze.difficulty === 'easy' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
              maze.difficulty === 'medium' ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' :
              maze.difficulty === 'hard' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
              'text-rose-400 border-rose-500/30 bg-rose-500/10'
            }`}>
              {maze.difficulty === 'easy' ? (language === 'pt' ? 'Fácil' : 'Easy') :
               maze.difficulty === 'medium' ? (language === 'pt' ? 'Médio' : 'Medium') :
               maze.difficulty === 'hard' ? (language === 'pt' ? 'Difícil' : 'Hard') :
               'Hard Master'}
            </span>
            <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
            <span className="truncate hidden sm:inline">{language === 'pt' ? maze.subtitlePt : maze.subtitleEn}</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-2">
            <span>{language === 'pt' ? maze.titlePt : maze.titleEn}</span>
            <button
              onClick={onToggleHint}
              className={`p-1 rounded transition-colors ${
                showHint ? 'text-amber-400 bg-amber-400/20' : 'text-slate-400 hover:text-white'
              }`}
              title="Dica / Hint"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </h2>

          {/* Hint Dropdown Drawer */}
          {showHint && (
            <div className="mt-1 p-2.5 bg-slate-900/95 border border-amber-500/40 rounded text-xs text-amber-200/90 leading-relaxed shadow-lg">
              {language === 'pt' ? maze.hintPt : maze.hintEn}
            </div>
          )}
        </div>

        {/* Top-Right: Moves vs Par & Timer */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-4 px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded font-mono text-xs text-slate-300 shadow-md">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 uppercase tracking-wider">{language === 'pt' ? 'Movimentos' : 'Moves'}</span>
              <span className="font-bold text-white tabular-nums text-sm">{moves}</span>
              <span className="text-slate-500">/ {maze.parMoves}</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 uppercase tracking-wider">{language === 'pt' ? 'Tempo' : 'Time'}</span>
              <span className="font-bold text-amber-400 tabular-nums">{formatTime(timeSeconds)}</span>
            </div>
          </div>

          <button
            onClick={onOpenMenu}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded transition-colors shadow-md"
            title="Menu / Pause (Esc)"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Dock: Controls & Action */}
      <div className="w-full flex flex-col items-center gap-3 pb-2">
        {/* Interactive Action Button for mechanics requiring Space */}
        {actionLabel && (
          <div className="pointer-events-auto">
            <button
              onClick={onActionClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{actionLabel}</span>
              <span className="text-[10px] opacity-75 font-mono">(Space)</span>
            </button>
          </div>
        )}

        {/* Dock Bar */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg shadow-lg">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              canUndo
                ? 'text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title="Desfazer / Undo (Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'Desfazer (Z)' : 'Undo (Z)'}</span>
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-200 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Reiniciar / Restart (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'Reiniciar (R)' : 'Restart (R)'}</span>
          </button>

          <span aria-hidden="true" className="text-slate-700">·</span>

          <button
            onClick={onToggleSound}
            className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Alternar Áudio / Toggle Audio"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
          </button>
        </div>

        {/* Flat control line */}
        <div className="text-[11px] text-slate-400 font-mono tracking-wide text-center">
          <span>WASD / Arrows {language === 'pt' ? 'Mover' : 'Move'}</span>
          <span aria-hidden="true" className="mx-2 text-slate-600">·</span>
          <span>Space {language === 'pt' ? 'Ação' : 'Action'}</span>
          <span aria-hidden="true" className="mx-2 text-slate-600">·</span>
          <span>Z {language === 'pt' ? 'Desfazer' : 'Undo'}</span>
          <span aria-hidden="true" className="mx-2 text-slate-600">·</span>
          <span>R {language === 'pt' ? 'Reiniciar' : 'Restart'}</span>
        </div>
      </div>
    </div>
  );
};
