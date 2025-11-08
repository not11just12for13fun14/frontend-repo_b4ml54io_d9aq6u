import React, { useState } from 'react';
import HeroSplineCover from './components/HeroSplineCover';
import ControlPanel from './components/ControlPanel';
import Legend from './components/Legend';
import SolarSystem2D from './components/SolarSystem2D';

export default function App() {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [scale, setScale] = useState(1);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSplineCover />

      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 space-y-6 md:space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 order-2 md:order-none">
            <SolarSystem2D paused={paused} speed={speed} scale={scale} />
          </div>
          <div className="space-y-4 order-1 md:order-none">
            <ControlPanel
              isPaused={paused}
              speed={speed}
              onTogglePause={() => setPaused((p) => !p)}
              onSpeedChange={setSpeed}
              scale={scale}
              onScaleChange={setScale}
            />
            <Legend />
            <section className="bg-zinc-900/70 backdrop-blur rounded-xl p-4 border border-zinc-800 text-zinc-300">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">About this model</h3>
              <p className="text-sm leading-relaxed">
                This is a stylized 2D visualization of our solar system. Orbital distances, sizes, and periods are compressed for clarity. Moons are distributed deterministically to reflect approximate counts per planet, orbiting their host planets while planets orbit the Sun.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-zinc-500 text-sm">
        Built with love for space and motion.
      </footer>
    </div>
  );
}
