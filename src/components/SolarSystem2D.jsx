import React, { useEffect, useRef } from 'react';

// Simplified 2D solar system animation on a Canvas. Distances, sizes, and periods are not to scale.
// Focus: Visualizes the Sun, all 8 planets, and moons orbiting their host planets.

const PLANETS = [
  {
    name: 'Mercury', color: '#d4d4d8', radius: 3, orbitR: 30, period: 88, moons: 0,
  },
  {
    name: 'Venus', color: '#fbbf24', radius: 5, orbitR: 45, period: 225, moons: 0,
  },
  {
    name: 'Earth', color: '#38bdf8', radius: 5.5, orbitR: 60, period: 365, moons: 1,
  },
  {
    name: 'Mars', color: '#f87171', radius: 4.5, orbitR: 75, period: 687, moons: 2,
  },
  {
    name: 'Jupiter', color: '#fb923c', radius: 9, orbitR: 105, period: 4333, moons: 92,
  },
  {
    name: 'Saturn', color: '#fde68a', radius: 8, orbitR: 135, period: 10759, moons: 146,
  },
  {
    name: 'Uranus', color: '#67e8f9', radius: 7, orbitR: 165, period: 30687, moons: 28,
  },
  {
    name: 'Neptune', color: '#60a5fa', radius: 7, orbitR: 195, period: 60190, moons: 16,
  },
];

// Deterministic pseudo-random generator for stable moon distributions
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createMoons(seed, count, baseOrbit) {
  const rnd = mulberry32(seed);
  const moons = [];
  for (let i = 0; i < count; i++) {
    const r = 2 + rnd() * 2; // size
    // spread moon orbits around the planet
    const orbit = baseOrbit + 6 + i * 1.2 + rnd() * 0.8;
    // base period scaled approximately with distance
    const period = 2 + orbit * 0.15 + rnd() * 0.5;
    const phase = rnd() * Math.PI * 2;
    moons.push({ r, orbit, period, phase });
  }
  return moons;
}

export default function SolarSystem2D({ paused, speed = 1, scale = 1 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const stateRef = useRef({ t: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    function resize() {
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = Math.max(420, parent.clientHeight);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // Precompute moons per planet with deterministic seeds
    const moonsByPlanet = PLANETS.map((p, idx) =>
      createMoons(1234 + idx * 777, p.moons, p.radius)
    );

    function draw() {
      const { t } = stateRef.current;
      const { width, height } = canvas;
      // Clear with black background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center
      const cx = canvas.clientWidth / 2;
      const cy = canvas.clientHeight / 2;

      // Starfield (subtle)
      ctx.save();
      ctx.translate(0.5, 0.5);
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < 120; i++) {
        const x = (i * 97.3 + width * 0.13) % canvas.clientWidth;
        const y = (i * 53.7 + height * 0.29) % canvas.clientHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.restore();

      // Draw Sun
      const sunR = 14 * scale;
      const gradient = ctx.createRadialGradient(cx, cy, sunR * 0.3, cx, cy, sunR);
      gradient.addColorStop(0, '#fff59e');
      gradient.addColorStop(1, '#f59e0b');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fill();

      // Planetary orbits and bodies
      PLANETS.forEach((p, i) => {
        const orbitRadius = p.orbitR * scale * 2; // stretch spacing
        // Orbit path
        ctx.strokeStyle = 'rgba(148,163,184,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Angular position (t in days equivalent). speed amplifies time.
        const angle = ((t / p.period) % 1) * Math.PI * 2;
        const x = cx + Math.cos(angle) * orbitRadius;
        const y = cy + Math.sin(angle) * orbitRadius;

        // Planet
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.radius * scale, 0, Math.PI * 2);
        ctx.fill();

        // Special: Saturn rings
        if (p.name === 'Saturn') {
          ctx.strokeStyle = 'rgba(253, 230, 138, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(x, y, p.radius * 1.8 * scale, p.radius * 1.1 * scale, 0.3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Moons
        const moons = moonsByPlanet[i];
        if (moons.length) {
          ctx.strokeStyle = 'rgba(148,163,184,0.12)';
          moons.forEach((m, k) => {
            const mAngle = m.phase + ((t / m.period) % 1) * Math.PI * 2;
            const mx = x + Math.cos(mAngle) * (m.orbit * scale);
            const my = y + Math.sin(mAngle) * (m.orbit * scale);

            // Moon orbit path (optional subtle)
            if (k % 5 === 0) {
              ctx.beginPath();
              ctx.arc(x, y, m.orbit * scale, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Moon body
            ctx.fillStyle = '#e5e7eb';
            ctx.beginPath();
            ctx.arc(mx, my, Math.max(1, m.r * 0.6 * scale), 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });
    }

    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); // seconds
      last = now;
      if (!paused) {
        // Increase t as an abstract day counter. 60 = 60 days per second at speed=1.
        stateRef.current.t += dt * 60 * speed;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [paused, speed, scale]);

  return (
    <div className="relative w-full h-[70vh] md:h-[75vh] bg-black rounded-2xl border border-zinc-800 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
    </div>
  );
}
