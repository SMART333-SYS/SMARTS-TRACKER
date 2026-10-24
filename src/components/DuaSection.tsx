import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Heart,
  Info,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Language } from '../types/index.ts';
import {
  DUA_CATEGORIES,
  DUA_LIBRARY,
  DuaItem,
  getDuaOfTheDay,
} from '../data/duaData.ts';
import { duaAudioPlayer } from '../utils/duaAudio.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';
import { formatDisplayDate, getHijriDateString, getTodayKey } from '../utils/date.ts';

interface DuaSectionProps {
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  selectedDate?: string;
  isDuaCompletedToday?: boolean;
  onToggleDuaCompleted?: () => void;
}

export const DuaSection: React.FC<DuaSectionProps> = ({
  language,
  soundEnabled,
  hapticEnabled,
  selectedDate,
  isDuaCompletedToday = false,
  onToggleDuaCompleted,
}) => {
  const currentDateKey = selectedDate || getTodayKey();
  const todayDua = getDuaOfTheDay(currentDateKey);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingDuaId, setPlayingDuaId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Recitation counts tracker per dua
  const [readCounts, setReadCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`mr_smart_dua_counts_${currentDateKey}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`mr_smart_dua_counts_${currentDateKey}`, JSON.stringify(readCounts));
    } catch {}
  }, [readCounts, currentDateKey]);

  // Subscribe to audio player status
  useEffect(() => {
    const unsub = duaAudioPlayer.subscribe((isPlaying, duaId) => {
      setPlayingDuaId(isPlaying ? duaId : null);
    });
    return () => {
      unsub();
      duaAudioPlayer.stop();
    };
  }, []);

  const handlePlayRecitation = (dua: DuaItem) => {
    triggerHaptic(20, hapticEnabled);
    if (playingDuaId === dua.id) {
      duaAudioPlayer.stop();
    } else {
      duaAudioPlayer.playDua(dua.id, dua.arabic, 0.85);
    }
  };

  const handleIncrementCount = (dua: DuaItem) => {
    triggerHaptic(20, hapticEnabled);
    if (soundEnabled) soundManager.playBead(true);

    setReadCounts((prev) => {
      const current = prev[dua.id] || 0;
      const next = current + 1;
      if (next === dua.recommendedCount && soundEnabled) {
        soundManager.playSuccess(true);
      }
      return { ...prev, [dua.id]: next };
    });
  };

  const handleResetCount = (duaId: string) => {
    triggerHaptic(15, hapticEnabled);
    setReadCounts((prev) => ({ ...prev, [duaId]: 0 }));
  };

  const handleCopy = (dua: DuaItem) => {
    triggerHaptic(15, hapticEnabled);
    const textToCopy = `${dua.arabic}\n\nUrdu: ${dua.urdu}\n\nEnglish: ${dua.english}\n\nRef: ${dua.reference}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Duas
  const filteredDuas = DUA_LIBRARY.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'daily'
        ? item.id === todayDua.id
        : item.category === selectedCategory;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.titleUrdu.toLowerCase().includes(q) ||
      item.titleRoman.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.arabic.includes(q) ||
      item.urdu.includes(q) ||
      item.romanUrdu.toLowerCase().includes(q) ||
      item.reference.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header Banner & Today's Islamic Date */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'urdu' ? 'روزانہ مسنون دعائیں' : 'Daily Sunnah Duas & Adhkar'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400 shrink-0" />
              <span>{language === 'urdu' ? 'دعائیں اور روزانہ اذکار' : language === 'roman-urdu' ? 'Duain & Daily Adhkar' : 'Daily Duas & Supplications'}</span>
            </h1>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
              {language === 'urdu'
                ? 'مستند احادیث و قرآن سے روزانہ مسنون دعائیں، عربی تلاوت آڈیو اور ترجمہ کے ساتھ۔'
                : 'Authentic prophetic duas with audio recitation, Urdu and English translation, and counter.'}
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/15">
            <span className="text-[11px] font-medium text-emerald-200">
              {formatDisplayDate(currentDateKey, language).main}
            </span>
            <span className="text-sm font-bold text-white font-arabic">
              {getHijriDateString(currentDateKey, language)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. HERO: Dua of the Day (آج کی منتخب دعا) */}
      <section className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-sm overflow-hidden transition-all">
        {/* Hero Top Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-pulse" />
            <h2 className="text-sm sm:text-base font-black tracking-wide uppercase">
              {language === 'urdu' ? '✨ آج کی منتخب دعا (Dua of the Day)' : '✨ Dua of the Day (آج کی دعا)'}
            </h2>
          </div>

          {/* Routine Tracker Completion Checkbox */}
          {onToggleDuaCompleted && (
            <button
              onClick={() => {
                triggerHaptic(20, hapticEnabled);
                if (soundEnabled && !isDuaCompletedToday) soundManager.playSuccess(true);
                onToggleDuaCompleted();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isDuaCompletedToday
                  ? 'bg-emerald-300 text-emerald-950 ring-2 ring-white/50'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isDuaCompletedToday
                  ? language === 'urdu'
                    ? 'پڑھ لیا ✓'
                    : 'Recited Today ✓'
                  : language === 'urdu'
                  ? 'معمول میں شامل کریں'
                  : 'Mark as Recited'}
              </span>
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Dua Title */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'urdu'
                  ? todayDua.titleUrdu
                  : language === 'roman-urdu'
                  ? todayDua.titleRoman
                  : todayDua.titleEn}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <span>{todayDua.reference}</span>
              </p>
            </div>

            {/* Quick Actions (Audio Play & Copy) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayRecitation(todayDua)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  playingDuaId === todayDua.id
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                }`}
                title="تلاوت سنیں (Listen Audio Recitation)"
              >
                {playingDuaId === todayDua.id ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{language === 'urdu' ? 'وقفہ' : 'Stop Recitation'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'urdu' ? 'تلاوت سنیں' : 'Listen Audio'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopy(todayDua)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                title="کاپی کریں (Copy Dua)"
              >
                {copiedId === todayDua.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Large Arabic Text Display with Tashkeel */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 sm:p-6 text-center relative overflow-hidden">
            <div className="text-2xl sm:text-3xl md:text-4xl leading-loose font-arabic text-emerald-950 font-bold tracking-wide select-all" dir="rtl">
              {todayDua.arabic}
            </div>
            {todayDua.transliteration && (
              <p className="mt-3 text-xs italic text-slate-500 font-sans tracking-wide">
                "{todayDua.transliteration}"
              </p>
            )}
          </div>

          {/* Translations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                اردو ترجمہ (Urdu)
              </span>
              <p className="text-sm font-medium text-slate-800 leading-relaxed font-urdu" dir="rtl">
                {todayDua.urdu}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                English Translation
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {todayDua.english}
              </p>
            </div>
          </div>

          {/* Benefit / Fazilat Box */}
          <div className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200/80 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">
                {language === 'urdu' ? 'فضیلت و برکت: ' : 'Benefit & Virtue: '}
              </strong>
              <span>
                {language === 'urdu'
                  ? todayDua.benefitUrdu
                  : language === 'roman-urdu'
                  ? todayDua.benefitRoman
                  : todayDua.benefitEn}
              </span>
            </div>
          </div>

          {/* Recitation Counter */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {language === 'urdu' ? 'تعداد تسبیح:' : 'Recitations:'}
              </span>
              <span className="text-sm font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {readCounts[todayDua.id] || 0} / {todayDua.recommendedCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleResetCount(todayDua.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="Reset counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleIncrementCount(todayDua)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs active:scale-95 transition-all"
              >
                <span>{language === 'urdu' ? 'پڑھیں (+1)' : 'Tap Read (+1)'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dua Library Navigation & Categories */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'urdu'
                ? 'دعا تلاش کریں (عنوان، عربی، ترجمہ یا فضیلت)...'
                : 'Search any Dua (title, topic, Arabic, translation)...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {DUA_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const getCatGradient = (id: string) => {
              switch (id) {
                case 'daily':
                  return 'from-sky-500 to-blue-600';
                case 'morning-evening':
                  return 'from-amber-500 to-orange-500';
                case 'protection':
                  return 'from-rose-500 to-red-600';
                case 'forgiveness':
                  return 'from-purple-500 to-indigo-600';
                case 'quranic':
                  return 'from-emerald-600 to-teal-600';
                case 'rizq-success':
                  return 'from-teal-500 to-emerald-600';
                default:
                  return 'from-emerald-700 to-teal-800';
              }
            };

            return (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic(15, hapticEnabled);
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  isActive
                    ? `bg-gradient-to-r ${getCatGradient(cat.id)} text-white shadow-md shadow-emerald-600/20`
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-2xs'
                }`}
              >
                {language === 'urdu' ? cat.nameUrdu : language === 'roman-urdu' ? cat.nameRoman : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Dua Cards Grid */}
      <div className="space-y-4">
        {filteredDuas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">
              {language === 'urdu' ? 'کوئی دعا نہیں ملی۔' : 'No Duas found matching your query.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs font-bold text-emerald-700 hover:underline"
            >
              {language === 'urdu' ? 'تمام دعائیں دیکھیں' : 'View all Duas'}
            </button>
          </div>
        ) : (
          filteredDuas.map((dua) => {
            const count = readCounts[dua.id] || 0;
            const isPlaying = playingDuaId === dua.id;
            const isCompleted = count >= dua.recommendedCount;

            return (
              <div
                key={dua.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-2xs ${
                  isCompleted
                    ? 'border-emerald-300/80 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {language === 'urdu'
                        ? dua.titleUrdu
                        : language === 'roman-urdu'
                        ? dua.titleRoman
                        : dua.titleEn}
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {dua.reference}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePlayRecitation(dua)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isPlaying
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                      title="تلاوت سنیں"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(dua)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="کاپی کریں"
                    >
                      {copiedId === dua.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Arabic Body */}
                <div className="my-3.5 p-4 rounded-xl bg-slate-50 text-center border border-slate-100">
                  <p className="text-xl sm:text-2xl font-arabic font-bold text-slate-900 leading-loose select-all" dir="rtl">
                    {dua.arabic}
                  </p>
                </div>

                {/* Urdu Translation */}
                <div className="mb-3">
                  <p className="text-xs sm:text-sm font-urdu text-slate-800 leading-relaxed" dir="rtl">
                    {dua.urdu}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 italic">
                    {dua.english}
                  </p>
                </div>

                {/* Benefit Footer + Counter */}
                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-amber-800 max-w-sm">
                    <strong>فضیلت: </strong>
                    <span>
                      {language === 'urdu'
                        ? dua.benefitUrdu
                        : language === 'roman-urdu'
                        ? dua.benefitRoman
                        : dua.benefitEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-slate-700">
                      {count} / {dua.recommendedCount}
                    </span>
                    <button
                      onClick={() => handleIncrementCount(dua)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-white hover:bg-emerald-800 active:scale-95'
                      }`}
                    >
                      {isCompleted ? 'مکمل ✓' : '+1 پڑھا'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
