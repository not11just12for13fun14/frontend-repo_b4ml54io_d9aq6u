import React from 'react';

const items = [
  { key: 'sun', name: 'Sun', color: 'bg-yellow-400' },
  { key: 'mercury', name: 'Mercury', color: 'bg-zinc-300' },
  { key: 'venus', name: 'Venus', color: 'bg-amber-300' },
  { key: 'earth', name: 'Earth', color: 'bg-sky-400' },
  { key: 'moon', name: "Earth's Moon", color: 'bg-gray-300' },
  { key: 'mars', name: 'Mars', color: 'bg-red-400' },
  { key: 'jupiter', name: 'Jupiter', color: 'bg-orange-300' },
  { key: 'saturn', name: 'Saturn', color: 'bg-yellow-200' },
  { key: 'uranus', name: 'Uranus', color: 'bg-cyan-300' },
  { key: 'neptune', name: 'Neptune', color: 'bg-blue-400' },
];

export default function Legend() {
  return (
    <div className="bg-zinc-900/70 backdrop-blur rounded-xl p-4 border border-zinc-800 text-zinc-100">
      <h3 className="text-sm font-semibold mb-3">Legend</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-zinc-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
