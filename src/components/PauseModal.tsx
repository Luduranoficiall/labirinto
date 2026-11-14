import React from 'react';
import { Play, RotateCcw, Grid, Volume2, VolumeX, Globe, X } from 'lucide-react';
import { Language } from '../types/game';

interface PauseModalProps {
  language: Language;
  soundEnabled: boolean;
  volume: number;
  onResume: () => void;
  onRestart: () => void;
  onGallery: () => void;
  onToggleSound: () => void;
  onChangeVolume: (vol: number) => void;
  onToggleLanguage: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  language,
  soundEnabled,
  volume,
  onResume,
  onRestart,
  onGallery,
  onToggleSound,
  onChangeVolume,
  onToggleLanguage
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-none flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-[#141822] border border-slate-700/80 rounded-xl p-6 md:p-8 max-w-sm w-full text-slate-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onResume}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>{language === 'pt' ? 'Pausa' : 'Paused'}</span>
        </h2>

        {/* Primary Actions */}
        <div className="flex flex-col gap-2.5 mb-6">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{language === 'pt' ? 'Continuar (Esc)' : 'Resume (Esc)'}</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'pt' ? 'Reiniciar Labirinto (R)' : 'Restart Maze (R)'}</span>
          </button>

          <button
            onClick={onGallery}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <span>{language === 'pt' ? 'Seleção de Labirintos' : 'Level Select'}</span>
          </button>
        </div>

        {/* Settings Area */}
        <div className="border-t border-slate-800 pt-5 flex flex-col gap-4 text-xs font-mono">
          {/* Sound & Volume */}
          <div className="flex items-center justify-between">
            <button
              onClick={onToggleSound}
              className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
              <span>{soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => onChangeVolume(parseFloat(e.target.value))}
              className="w-24 accent-amber-500 cursor-pointer"
              title="Volume"
            />
          </div>

          {/* Language Switch */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-400">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{language === 'pt' ? 'Idioma' : 'Language'}</span>
            </span>
            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded uppercase cursor-pointer"
            >
              {language === 'pt' ? 'Português (BR)' : 'English'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
