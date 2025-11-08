import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSplineCover() {
  return (
    <section className="relative w-full h-[60vh] overflow-hidden bg-black">
      <Spline
        scene="https://prod.spline.design/ZbxuTuCsFbT2izmF/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">Solar System</h1>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            A 2D animated model featuring the Sun, all planets, and their moons orbiting in real time. Use the controls to pause or change speed.
          </p>
        </div>
      </div>
    </section>
  );
}
