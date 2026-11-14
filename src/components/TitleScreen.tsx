import React from 'react';
import { Play, Grid, Volume2, VolumeX, Globe } from 'lucide-react';
import { Language } from '../types/game';

interface TitleScreenProps {
  onStart: () => void;
  onOpenGallery: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: Language;
  onToggleLanguage: () => void;
  completedCount: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenGallery,
  soundEnabled,
  onToggleSound,
  language,
  onToggleLanguage,
  completedCount
}) => {
  return (
    <div className="relative w-full h-screen bg-[#0e1117] text-slate-100 flex flex-col items-center justify-between p-8 select-none overflow-hidden">
      {/* Subtle geometric blueprint grid backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top perimeter controls bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono tracking-wider">
          <span>FLEB-INSPIRED PUZZLE LAB</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-semibold text-amber-400">
            {completedCount}/32 {language === 'pt' ? 'RESOLVIDOS' : 'SOLVED'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-500 hidden sm:inline">
            {language === 'pt' ? 'FÁCIL · MÉDIO · DIFÍCIL · HARD MASTER' : 'EASY · MEDIUM · HARD · HARD MASTER'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors"
            title="Alternar idioma / Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono uppercase">{language}</span>
          </button>

          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors"
            title="Mute / Unmute"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="font-mono">{soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup over negative space */}
      <div className="flex flex-col items-center justify-center text-center z-10 max-w-3xl my-auto">
        {/* Decorative micro labyrinth glyph */}
        <div className="mb-6 flex justify-center">
          <svg className="w-16 h-16 text-amber-400/90" viewBox="0 0 64 64" fill="none" stroke="currentColor">
            <rect x="6" y="6" width="52" height="52" rx="4" strokeWidth="2.5" />
            <path d="M6 24 H38 V40 H20 V58" strokeWidth="2.5" />
            <path d="M46 6 V28 H58" strokeWidth="2.5" />
            <circle cx="16" cy="15" r="4" fill="currentColor" />
            <circle cx="48" cy="48" r="4" strokeWidth="2" stroke="#38bdf8" fill="none" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3">
          {language === 'pt' ? (
            <>
              32 LABIRINTOS
              <span className="block text-2xl md:text-3xl font-medium text-amber-400 mt-2">
                de alguma forma ainda menores
              </span>
            </>
          ) : (
            <>
              32 EVEN SMALLER
              <span className="block text-2xl md:text-3xl font-medium text-amber-400 mt-2">
                MAZES
              </span>
            </>
          )}
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          {language === 'pt'
            ? 'Um tributo a FLEB e à comunidade de jogos Godot. Trinta e dois micro-labirintos divididos em 4 níveis: Fácil, Médio, Difícil e Hard Master.'
            : 'A loving homage to FLEB and the Godot game craft community. Thirty-two micro-mazes structured into 4 distinct tiers: Easy, Medium, Hard, and Hard Master.'}
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onStart}
            className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-amber-500/20 text-sm md:text-base cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
            <span>{language === 'pt' ? 'INICIAR AVENTURA' : 'START ADVENTURE'}</span>
          </button>

          <button
            onClick={onOpenGallery}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors border border-slate-700 text-sm cursor-pointer"
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <span>{language === 'pt' ? 'ESCOLHER FASE (1-32)' : 'LEVEL SELECT (1-32)'}</span>
          </button>
        </div>
      </div>

      {/* Flat control-hint line along bottom */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-2 z-10">
        <div className="text-xs text-slate-400 font-mono tracking-wide flex items-center flex-wrap justify-center gap-2">
          <span>WASD / ↑↓←→ {language === 'pt' ? 'Mover' : 'Move'}</span>
          <span aria-hidden="true">·</span>
          <span>Space {language === 'pt' ? 'Ação' : 'Action'}</span>
          <span aria-hidden="true">·</span>
          <span>Z {language === 'pt' ? 'Desfazer' : 'Undo'}</span>
          <span aria-hidden="true">·</span>
          <span>R {language === 'pt' ? 'Reiniciar' : 'Restart'}</span>
          <span aria-hidden="true">·</span>
          <span>Esc {language === 'pt' ? 'Pausa' : 'Pause'}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          {language === 'pt'
            ? 'Pressione ENTER ou ESPAÇO para começar agora'
            : 'Press ENTER or SPACE to start immediately'}
        </div>
      </div>
    </div>
  );
};
