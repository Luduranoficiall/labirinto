import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Footprints, Filter } from 'lucide-react';
import { MAZES } from '../data/mazes';
import { Difficulty, GameSaveData, Language } from '../types/game';

interface GalleryScreenProps {
  saveData: GameSaveData;
  language: Language;
  onSelectMaze: (id: number) => void;
  onBack: () => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({
  saveData,
  language,
  onSelectMaze,
  onBack
}) => {
  const [selectedFilter, setSelectedFilter] = useState<Difficulty | 'all'>('all');

  const totalStars = Object.values(saveData.mazes).reduce((acc, m) => acc + (m.stars || 0), 0);
  const totalCompleted = Object.values(saveData.mazes).filter(m => m.completed).length;

  const filteredMazes = selectedFilter === 'all'
    ? MAZES
    : MAZES.filter(m => m.difficulty === selectedFilter);

  const getDifficultyLabel = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return language === 'pt' ? 'Fácil' : 'Easy';
      case 'medium':
        return language === 'pt' ? 'Médio' : 'Medium';
      case 'hard':
        return language === 'pt' ? 'Difícil' : 'Hard';
      case 'master':
        return 'Hard Master';
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'medium':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'hard':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'master':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    }
  };

  const difficultyStats = (diff: Difficulty) => {
    const list = MAZES.filter(m => m.difficulty === diff);
    const completed = list.filter(m => saveData.mazes[m.id]?.completed).length;
    return `${completed}/${list.length}`;
  };

  return (
    <div className="relative w-full h-screen bg-[#0e1117] text-slate-100 flex flex-col p-6 select-none overflow-hidden">
      {/* Background blueprint subtle lines */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'pt' ? 'Menu Principal' : 'Main Menu'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="font-bold text-white tabular-nums">{totalCompleted} / {MAZES.length}</span>
            <span>{language === 'pt' ? 'Concluídos' : 'Cleared'}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="tabular-nums font-bold">{totalStars} / {MAZES.length * 3}</span>
            </div>
          </div>
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'pt' ? 'Todos (32)' : 'All (32)'}
          </button>

          <button
            onClick={() => setSelectedFilter('easy')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              selectedFilter === 'easy'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-emerald-400/80 hover:text-emerald-300'
            }`}
          >
            <span>{language === 'pt' ? 'Fácil' : 'Easy'}</span>
            <span className="text-[10px] opacity-75 font-mono">({difficultyStats('easy')})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('medium')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              selectedFilter === 'medium'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-sky-400/80 hover:text-sky-300'
            }`}
          >
            <span>{language === 'pt' ? 'Médio' : 'Medium'}</span>
            <span className="text-[10px] opacity-75 font-mono">({difficultyStats('medium')})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('hard')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              selectedFilter === 'hard'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <span>{language === 'pt' ? 'Difícil' : 'Hard'}</span>
            <span className="text-[10px] opacity-75 font-mono">({difficultyStats('hard')})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('master')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              selectedFilter === 'master'
                ? 'bg-rose-500 text-slate-950 font-bold'
                : 'text-rose-400/80 hover:text-rose-300'
            }`}
          >
            <span>Hard Master</span>
            <span className="text-[10px] opacity-75 font-mono">({difficultyStats('master')})</span>
          </button>
        </div>
      </div>

      {/* Diorama Workbench Grid */}
      <div className="w-full max-w-6xl mx-auto flex-1 overflow-y-auto pr-2 custom-scrollbar z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 pb-8">
          {filteredMazes.map(maze => {
            const progress = saveData.mazes[maze.id];
            const isCompleted = progress?.completed;
            const stars = progress?.stars || 0;
            const isCurrent = saveData.currentMazeId === maze.id;

            return (
              <button
                key={maze.id}
                onClick={() => onSelectMaze(maze.id)}
                className={`flex flex-col text-left p-3.5 rounded-lg border transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                    : isCompleted
                    ? 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                }`}
              >
                {/* Card Header: Number, Difficulty Tag & Stars */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{String(maze.id).padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getDifficultyColor(maze.difficulty)}`}>
                      {getDifficultyLabel(maze.difficulty)}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 fill-none'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Maze Title */}
                <h3 className="text-xs font-semibold text-white truncate mb-1">
                  {language === 'pt' ? maze.titlePt : maze.titleEn}
                </h3>

                {/* Subtitle / Mechanic tag */}
                <p className="text-[11px] text-slate-400 truncate mb-3">
                  {language === 'pt' ? maze.taglinePt : maze.taglineEn}
                </p>

                {/* Stats Footer */}
                <div className="mt-auto pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3 h-3 text-slate-500" />
                    {progress?.bestMoves ? (
                      <span className="tabular-nums text-slate-300">
                        {progress.bestMoves}
                        <span className="text-slate-600">/{maze.parMoves}</span>
                      </span>
                    ) : (
                      <span className="text-slate-600">Par {maze.parMoves}</span>
                    )}
                  </span>

                  {progress?.bestTimeSeconds && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="tabular-nums text-slate-300">{progress.bestTimeSeconds}s</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
