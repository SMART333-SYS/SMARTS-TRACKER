import React, { useState } from 'react';
import { Award, Check, Flame, RefreshCw, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { Language } from '../types/index.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';
import confetti from 'canvas-confetti';

interface TasbeehSectionProps {
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  counts: Record<string, number>;
  onUpdateCount: (dhikrId: string, count: number) => void;
}

interface DhikrPreset {
  id: string;
  arabic: string;
  roman: string;
  urdu: string;
  en: string;
  defaultTarget: number;
  colorGradient: string;
  badgeBg: string;
}

const PRESETS: DhikrPreset[] = [
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
    roman: "Astaghfirullahal 'Azeem",
    urdu: 'میں اللہ سے بخشش مانگتا ہوں',
    en: 'I seek forgiveness from Allah',
    defaultTarget: 100,
    colorGradient: 'from-violet-600 to-indigo-600',
    badgeBg: 'hover:border-violet-400',
  },
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    roman: 'SubhanAllah',
    urdu: 'اللہ پاک ہے',
    en: 'Glory be to Allah',
    defaultTarget: 33,
    colorGradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'hover:border-emerald-400',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    roman: 'Alhamdulillah',
    urdu: 'تمام تعریفیں اللہ کے لیے ہیں',
    en: 'Praise be to Allah',
    defaultTarget: 33,
    colorGradient: 'from-sky-500 to-blue-600',
    badgeBg: 'hover:border-sky-400',
  },
  {
    id: 'allahu_akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    roman: 'Allahu Akbar',
    urdu: 'اللہ سب سے بڑا ہے',
    en: 'Allah is the Greatest',
    defaultTarget: 34,
    colorGradient: 'from-amber-500 to-orange-600',
    badgeBg: 'hover:border-amber-400',
  },
  {
    id: 'durood',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
    roman: 'Allahumma Salli Ala Muhammad',
    urdu: 'اے اللہ! محمد اور آلِ محمد پر رحمت نازل فرما',
    en: 'O Allah send blessings upon Muhammad',
    defaultTarget: 100,
    colorGradient: 'from-rose-500 to-pink-600',
    badgeBg: 'hover:border-rose-400',
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    roman: 'La Ilaha Illallah',
    urdu: 'اللہ کے سوا کوئی معبود نہیں',
    en: 'There is no god but Allah',
    defaultTarget: 100,
    colorGradient: 'from-teal-600 to-emerald-700',
    badgeBg: 'hover:border-teal-400',
  },
];

export const TasbeehSection: React.FC<TasbeehSectionProps> = ({
  language,
  soundEnabled,
  hapticEnabled,
  counts,
  onUpdateCount,
}) => {
  const [selectedDhikr, setSelectedDhikr] = useState<string>('astaghfirullah');
  const [target, setTarget] = useState<number>(100);
  const [laps, setLaps] = useState<number>(0);

  const activePreset = PRESETS.find((p) => p.id === selectedDhikr) || PRESETS[0];
  const currentCount = counts[selectedDhikr] || 0;

  const handleTap = () => {
    triggerHaptic(25, hapticEnabled);
    soundManager.playBead(soundEnabled);

    const nextCount = currentCount + 1;
    onUpdateCount(selectedDhikr, nextCount);

    // If target reached
    if (nextCount > 0 && nextCount % target === 0) {
      soundManager.playSuccess(soundEnabled);
      setLaps((prev) => prev + 1);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    }
  };

  const handleReset = () => {
    triggerHaptic(20, hapticEnabled);
    onUpdateCount(selectedDhikr, 0);
  };

  const progressPercent = Math.min(100, Math.round(((currentCount % target) / target) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Header & Presets */}
      <div className="bg-gradient-to-br from-white via-amber-50/20 to-emerald-50/20 rounded-3xl p-6 border border-amber-300/30 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'urdu' ? 'ذکر و تسبیح کا نور' : 'Dhikr & Tasbeeh'}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500 fill-current animate-bounce" />
              <span>
                {language === 'urdu'
                  ? 'ڈیجیٹل تسبیح و اذکار'
                  : language === 'roman-urdu'
                  ? 'Digital Tasbeeh & Dhikr'
                  : 'Digital Tasbeeh Counter'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              {language === 'urdu'
                ? 'دلوں کا سکون اللہ کے ذکر میں ہے۔ تسبیح پڑھنے کے لیے دائرے پر ٹیپ کریں۔'
                : 'Dilon ka itminaan Allah ke zikr me hai. Tasbeeh tap karein.'}
            </p>
          </div>

          {/* Targets */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold shadow-inner border border-slate-200">
            <span className="text-slate-500 px-2 font-medium">Target:</span>
            {[33, 100, 313, 1000].map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-3 py-1.5 rounded-xl transition-all duration-200 tabular-nums active:scale-95 ${
                  target === t
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Chips */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = p.id === selectedDhikr;
            return (
              <button
                key={p.id}
                onClick={() => {
                  triggerHaptic(15, hapticEnabled);
                  setSelectedDhikr(p.id);
                  setTarget(p.defaultTarget);
                }}
                className={`p-3 rounded-2xl text-left transition-all duration-200 active:scale-95 border ${
                  isSelected
                    ? `bg-gradient-to-br ${p.colorGradient} text-white shadow-md shadow-emerald-500/20 scale-[1.02] border-white/20`
                    : `bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs ${p.badgeBg}`
                }`}
              >
                <span className="block font-bold text-xs truncate">{p.roman}</span>
                <span className="text-[11px] font-arabic font-semibold block truncate mt-0.5 opacity-90">
                  {p.arabic}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Interactive Bead Counter Card (Luxurious, Radiant Glow) */}
      <div className="bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Active Dhikr Display */}
        <div className="space-y-2 mb-6 relative z-10">
          <p className="font-arabic text-3xl sm:text-5xl text-amber-300 leading-relaxed drop-shadow-md">
            {activePreset.arabic}
          </p>
          <p className="text-base sm:text-lg font-bold text-emerald-100">
            {activePreset.roman}
          </p>
          <p className="text-xs sm:text-sm text-emerald-200/80 font-urdu max-w-md mx-auto">
            {activePreset.urdu}
          </p>
        </div>

        {/* Central Giant Tap Area */}
        <div className="flex flex-col items-center justify-center my-6 relative z-10">
          <button
            type="button"
            onClick={handleTap}
            className="group relative w-60 h-60 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 focus:outline-hidden"
            aria-label="Tap Tasbeeh Bead"
          >
            {/* Outer Progress Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
                className="text-amber-400 transition-all duration-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              />
            </svg>

            {/* Inner Bead Button Surface with Gold-Emerald Gradient Glow */}
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-radial from-slate-800 via-slate-900 to-slate-950 border-4 border-amber-400/50 group-hover:border-amber-300 shadow-2xl shadow-amber-500/20 flex flex-col items-center justify-center space-y-1 transition-all">
              <span className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-white tabular-nums drop-shadow-lg">
                {currentCount}
              </span>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'urdu' ? 'ٹیپ کریں' : 'Tap to Count'}</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold tabular-nums">
                Target: {target}
              </span>
            </div>
          </button>
        </div>

        {/* Controls Bar: Reset & Lap counters */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-slate-800/90 text-xs sm:text-sm relative z-10">
          <div className="flex items-center gap-2 text-slate-300 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              Laps Completed: <strong className="text-amber-300 tabular-nums">{laps}</strong>
            </span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl transition-all duration-200 active:scale-95 font-bold border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>{language === 'urdu' ? 'صفر کریں' : 'Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
