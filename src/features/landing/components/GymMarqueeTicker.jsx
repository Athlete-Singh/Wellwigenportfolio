import React from 'react';
import { Dumbbell, Zap, Flame, Activity } from 'lucide-react';

export default function GymMarqueeTicker() {
  const items = [
    { label: "HIIT", icon: "Flame" },
    { label: "TABATA", icon: "Zap" },
    { label: "YOGA", icon: "Activity" },
    { label: "STRENGTH", icon: "Dumbbell" },
    { label: "JUNGLE FIT", icon: "Flame" },
    { label: "LIVE COACHING", icon: "Zap" },
    { label: "TRAIN FROM ANYWHERE", icon: "Dumbbell" },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'Dumbbell': return <Dumbbell size={14} className="text-teal-400" />;
      case 'Zap': return <Zap size={14} className="text-amber-400" />;
      case 'Flame': return <Flame size={14} className="text-rose-400" />;
      default: return <Activity size={14} className="text-teal-400" />;
    }
  };

  // Duplicate for seamless infinite loop
  const tickerItems = [...items, ...items, ...items];

  return (
    <div data-nav-theme="dark" className="relative w-full bg-[#0E1420] text-white py-3.5 border-y border-[#2A3547] overflow-hidden group shadow-lg z-20">
      {/* Subtle blueprint grid & ECG line */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />

      {/* Glowing ECG beam accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-75" />

      {/* Marquee Track */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] items-center space-x-8 sm:space-x-12 select-none">
        {tickerItems.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            <span
              className={`font-display text-sm sm:text-base tracking-widest font-extrabold uppercase ${
                idx % 2 === 0
                  ? 'text-white'
                  : 'text-transparent [-webkit-text-stroke:1px_rgba(45,226,200,0.8)]'
              }`}
            >
              {item.label}
            </span>
            <div className="w-6 h-6 rounded-md bg-[#1E293B] flex items-center justify-center border border-[#2A3547]">
              {getIcon(item.icon)}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50" />
    </div>
  );
}
