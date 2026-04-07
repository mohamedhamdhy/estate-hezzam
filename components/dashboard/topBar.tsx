'use client';

import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: Props) {
  const [dateLabel, setDateLabel] = useState<string | null>(null);

  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    );
  }, []);

  return (
    <header className="h-13 md:h-15 shrink-0 bg-[#080B11] border-b border-white/6
      flex items-center px-4 md:px-6 gap-3">

      <button
        onClick={onMenuClick}
        className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 border border-white/10
          flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/10
          transition-colors cursor-pointer shrink-0"
        aria-label="Toggle sidebar"
      >
        <FiMenu size={24} />
      </button>

      <p className="font-['Cormorant_Garamond'] text-[17px] md:text-[19px] font-bold text-white flex-1 truncate">
        {title}
      </p>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2 bg-[#D4AF37]/3 border border-[#D4AF37]/20
          rounded-full px-3 py-1 md:px-4 md:py-1.5">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-['Outfit'] text-[9px] md:text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase">
            Live
          </span>
        </div>
        {dateLabel && (
          <p className="font-['Outfit'] text-[10px] md:text-[11px] text-white/25 hidden sm:block">
            {dateLabel}
          </p>
        )}
      </div>
    </header>
  );
}