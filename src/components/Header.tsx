import React from 'react';
import { ChevronLeft, ChevronRight, Flame, Shield, Volume2, VolumeX, Youtube, Sparkles } from 'lucide-react';
import { Language } from '../types/index.ts';
import { formatDisplayDate, getHijriDateString, getTodayKey, shiftDateKey } from '../utils/date.ts';
import { triggerHaptic } from '../utils/audio.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { PakistanClock } from './PakistanClock.tsx';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  selectedDate: string;
  onDateChange: (dateKey: string) => void;
  cleanStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenEmergency: () => void;
  onOpenTasbeeh: () => void;
  onToggleMiniPlayer?: () => void;
  isMiniPlayerOpen?: boolean;
  onOpenInstall?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  selectedDate,
  onDateChange,
  cleanStreak,
  soundEnabled,
  onToggleSound,
  onOpenEmergency,
  onOpenTasbeeh,
  onToggleMiniPlayer,
  isMiniPlayerOpen,
  onOpenInstall,
}) => {
  const todayKey = getTodayKey();
  const isToday = selectedDate === todayKey;
  const { main: displayDate, relative } = formatDisplayDate(selectedDate, language);
  const hijriDate = getHijriDateString(selectedDate, language);

  const handlePrevDay = () => {
    triggerHaptic(15);
    onDateChange(shiftDateKey(selectedDate, -1));
  };

  const handleNextDay = () => {
    triggerHaptic(15);
    onDateChange(shiftDateKey(selectedDate, 1));
  };

  const handleGoToday = () => {
    triggerHaptic(20);
    onDateChange(todayKey);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs relative">
      {/* Radiant Multi-Color Accent Strip at the very top */}
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 via-amber-400 to-rose-500" />

      {/* Primary Top Bar (Three-zone Top Bar Contract) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Wordmark & Compact Clock on small screens */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleGoToday}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-hidden active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-600/25 ring-2 ring-emerald-200/60 group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div className="whitespace-nowrap shrink-0">
              <span className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 bg-clip-text text-transparent tracking-tight block leading-tight">
                {language === 'urdu' ? 'سمروٹ ڈیلی روٹین' : 'SAMROOT DAILY ROUTINE'}
              </span>
              <span className="text-[11px] text-emerald-700/80 font-semibold hidden sm:flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{language === 'urdu' ? 'اسلامی لائف، نماز و فٹنس پورٹل' : 'Islamic Life, Namaz & Fitness Portal'}</span>
              </span>
            </div>
          </button>

          {/* Pakistan Time on Tablets / Mid screens */}
          <div className="hidden lg:block">
            <PakistanClock language={language} />
          </div>
        </div>

        {/* Zone 2: Date & Clean Streak indicator & Pakistan Clock on Mid screens */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="lg:hidden">
            <PakistanClock language={language} compact />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-50 to-emerald-50/40 border border-slate-200 shadow-xs">
            <button
              onClick={handlePrevDay}
              className="p-1 hover:text-emerald-700 text-slate-500 rounded-md transition-colors"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center px-2 cursor-pointer" onClick={handleGoToday}>
              <div className="font-bold text-slate-800">
                {relative ? `${relative} (${displayDate})` : displayDate}
              </div>
              <div className="text-[10px] text-emerald-700 font-arabic font-semibold">
                {hijriDate}
              </div>
            </div>
            <button
              onClick={handleNextDay}
              className="p-1 hover:text-emerald-700 text-slate-500 rounded-md transition-colors"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Glowing Clean Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-amber-500/20">
            <Flame className="w-4 h-4 text-yellow-200 fill-current animate-bounce" />
            <span className="tabular-nums">{cleanStreak}</span>
            <span className="text-[11px] font-medium text-amber-100">
              {language === 'urdu'
                ? 'دن پاکیزگی'
                : language === 'roman-urdu'
                ? 'Din Streak'
                : 'Days Pure'}
            </span>
          </div>
        </div>

        {/* Zone 3: Actions & Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Pakistan Time Pill */}
          <div className="md:hidden">
            <PakistanClock language={language} compact />
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-500 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* PWA Install Button (Works like offline Play Store app) */}
          <PWAInstallButton language={language} onClickOpenSection={onOpenInstall} />

          {/* YouTube Choti Screen (Mini Player) Toggle */}
          {onToggleMiniPlayer && (
            <button
              onClick={() => {
                triggerHaptic(20);
                onToggleMiniPlayer();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95 ${
                isMiniPlayerOpen
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-300'
                  : 'bg-gradient-to-r from-slate-100 to-red-50 hover:from-red-100 hover:to-red-200 text-slate-800 border border-red-200/60'
              }`}
              title="YouTube Choti Screen (Floating Mini Player)"
            >
              <Youtube className={`w-3.5 h-3.5 ${isMiniPlayerOpen ? 'text-white' : 'text-red-600'} fill-current`} />
              <span className="hidden sm:inline">
                {language === 'urdu' ? 'چھوٹی اسکرین' : 'Choti Screen'}
              </span>
            </button>
          )}

          {/* Emergency Guard Quick Trigger */}
          <button
            onClick={() => {
              triggerHaptic(30);
              onOpenEmergency();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-transform active:scale-95 shrink-0"
            title="Bura Khayal / Nafs Emergency Guard"
          >
            <Shield className="w-3.5 h-3.5 animate-pulse" />
            <span className="whitespace-nowrap">
              {language === 'urdu' ? 'ایمرجنسی گارڈ' : language === 'roman-urdu' ? 'Nafs Guard' : 'Emergency'}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-100 text-[11px] font-bold shadow-inner">
            <button
              onClick={() => onLanguageChange('roman-urdu')}
              className={`px-2 py-1 rounded-lg transition-all whitespace-nowrap ${
                language === 'roman-urdu'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Roman
            </button>
            <button
              onClick={() => onLanguageChange('urdu')}
              className={`px-2 py-1 rounded-lg transition-all whitespace-nowrap font-urdu ${
                language === 'urdu'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => onLanguageChange('english')}
              className={`px-2 py-1 rounded-lg transition-all whitespace-nowrap ${
                language === 'english'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-strip: Date navigation with colorful polish */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-50 via-emerald-50/30 to-slate-50 border-t border-slate-100 text-xs">
        <button
          onClick={handlePrevDay}
          className="p-1 text-slate-500 hover:text-emerald-700 active:scale-90"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2" onClick={handleGoToday}>
          <span className="font-bold text-slate-800">
            {relative ? `${relative} · ` : ''}{displayDate}
          </span>
          <span className="text-emerald-700 text-[11px] font-arabic font-semibold">
            ({hijriDate})
          </span>
          {!isToday && (
            <span className="text-[10px] text-emerald-600 underline font-bold">
              Go Today
            </span>
          )}
        </div>
        <button
          onClick={handleNextDay}
          className="p-1 text-slate-500 hover:text-emerald-700 active:scale-90"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
