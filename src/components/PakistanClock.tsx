import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getPakistanTimeInfo } from '../utils/pakistanTime.ts';
import { Language } from '../types/index.ts';

interface PakistanClockProps {
  language: Language;
  compact?: boolean;
}

export const PakistanClock: React.FC<PakistanClockProps> = ({ language, compact = false }) => {
  const [pktInfo, setPktInfo] = useState(() => getPakistanTimeInfo());

  useEffect(() => {
    // Ticking every 1000ms
    const interval = setInterval(() => {
      setPktInfo(getPakistanTimeInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/90 text-emerald-100 border border-emerald-500/30 text-xs shadow-xs font-mono"
        title="Pakistan Standard Time (UTC+5)"
      >
        <span className="text-sm">🇵🇰</span>
        <span className="text-[10px] font-sans font-semibold text-emerald-300 uppercase tracking-wider">
          PKT
        </span>
        <span className="font-bold tabular-nums text-white text-[11px] sm:text-xs">
          {pktInfo.time12}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white border border-emerald-500/40 shadow-sm"
      title="Pakistan Standard Time (PKT - UTC+5)"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base select-none leading-none">🇵🇰</span>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-emerald-300 tracking-wider">
              {language === 'urdu' ? 'پاکستان وقت' : 'PAKISTAN TIME'}
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-mono">
              PKT
            </span>
          </div>
          <span className="text-[9px] text-emerald-200/80 leading-none">
            {pktInfo.dateFormattedEn}
          </span>
        </div>
      </div>

      <div className="h-6 w-px bg-emerald-700/60" />

      <div className="flex items-center gap-1.5 font-mono">
        <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
        <span className="font-bold text-xs sm:text-sm tracking-tight tabular-nums text-white">
          {pktInfo.time12}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
      </div>
    </div>
  );
};
