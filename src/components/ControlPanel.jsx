import React from 'react';

export default function ControlPanel({ isPaused, speed, onTogglePause, onSpeedChange, scale, onScaleChange }) {
  return (
    <div className="w-full bg-zinc-900/70 backdrop-blur rounded-xl p-4 md:p-5 border border-zinc-800 text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Controls</h2>
          <p className="text-sm text-zinc-400">Play, pause, and adjust orbit speed and size.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onTogglePause}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors"
          >
            {isPaused ? 'Play' : 'Pause'}
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-300">Speed</label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-36 accent-indigo-500"
            />
            <span className="w-10 text-right text-sm text-zinc-400">{speed.toFixed(1)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-300">Scale</label>
            <input
              type="range"
              min="0.6"
              max="1.8"
              step="0.05"
              value={scale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-36 accent-indigo-500"
            />
            <span className="w-12 text-right text-sm text-zinc-400">{scale.toFixed(2)}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
