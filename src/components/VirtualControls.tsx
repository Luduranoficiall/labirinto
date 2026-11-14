import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CircleDot } from 'lucide-react';
import { Direction } from '../types/game';

interface VirtualControlsProps {
  onMove: (dir: Direction) => void;
  onAction: () => void;
  showActionButton: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMove,
  onAction,
  showActionButton
}) => {
  return (
    <div className="md:hidden absolute inset-x-0 bottom-16 pointer-events-none flex items-end justify-between px-6 z-30 select-none">
      {/* Directional Pad */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5 w-32 h-32 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 shadow-lg">
        <div />
        <button
          onClick={() => onMove('up')}
          className="flex items-center justify-center bg-slate-800/90 active:bg-amber-500 active:text-slate-950 text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div />

        <button
          onClick={() => onMove('left')}
          className="flex items-center justify-center bg-slate-800/90 active:bg-amber-500 active:text-slate-950 text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        </div>
        <button
          onClick={() => onMove('right')}
          className="flex items-center justify-center bg-slate-800/90 active:bg-amber-500 active:text-slate-950 text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div />
        <button
          onClick={() => onMove('down')}
          className="flex items-center justify-center bg-slate-800/90 active:bg-amber-500 active:text-slate-950 text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
        <div />
      </div>

      {/* Action Button */}
      {showActionButton && (
        <div className="pointer-events-auto">
          <button
            onClick={onAction}
            className="w-16 h-16 rounded-full bg-amber-500 active:bg-amber-400 text-slate-950 flex flex-col items-center justify-center shadow-lg font-bold text-xs cursor-pointer"
          >
            <CircleDot className="w-6 h-6 mb-0.5" />
            <span className="text-[10px] uppercase">Space</span>
          </button>
        </div>
      )}
    </div>
  );
};
