import React from 'react';
import { Star, ArrowRight, RotateCcw, Grid, Trophy } from 'lucide-react';
import { MazeConfig, Language } from '../types/game';

interface VictoryModalProps {
  maze: MazeConfig;
  moves: number;
  timeSeconds: number;
  stars: number;
  language: Language;
  onNext: () => void;
  onReplay: () => void;
  onGallery: () => void;
  isLastMaze: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  maze,
  moves,
  timeSeconds,
  stars,
  language,
  onNext,
  onReplay,
  onGallery,
  isLastMaze
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-none flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
      <div className="bg-[#141822] border border-amber-500/50 rounded-xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative">
        {/* Labyrinth victory emblem */}
        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Trophy className="w-7 h-7" />
        </div>

        <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
          {language === 'pt' ? 'Labirinto Concluído!' : 'Maze Solved!'}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          {language === 'pt' ? maze.titlePt : maze.titleEn}
        </h2>

        {/* Stars readout */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <Star
              key={s}
              className={`w-7 h-7 ${
                s <= stars
                  ? 'text-amber-400 fill-amber-400 animate-bounce'
                  : 'text-slate-700 fill-none'
              }`}
              style={{ animationDelay: `${s * 100}ms` }}
            />
          ))}
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-lg mb-6 font-mono text-xs">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase">
              {language === 'pt' ? 'Movimentos' : 'Moves'}
            </span>
            <div className="text-sm font-bold text-white tabular-nums mt-0.5">
              {moves}{' '}
              <span className="text-slate-500 font-normal">
                (Par {maze.parMoves})
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase">
              {language === 'pt' ? 'Tempo' : 'Time'}
            </span>
            <div className="text-sm font-bold text-amber-400 tabular-nums mt-0.5">
              {formatTime(timeSeconds)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {!isLastMaze ? (
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
            >
              <span>{language === 'pt' ? 'Próximo Labirinto' : 'Next Maze'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onGallery}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
            >
              <span>{language === 'pt' ? 'Ver Todos os Labirintos' : 'View All Mazes'}</span>
              <Grid className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplay}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'Repetir' : 'Replay'}</span>
            </button>

            <button
              onClick={onGallery}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'pt' ? 'Seleção' : 'Levels'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
