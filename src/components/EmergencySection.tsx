import React, { useState, useEffect } from 'react';
import { AlertTriangle, Award, CheckCircle2, ChevronRight, Compass, Flame, Heart, Play, Pause, RotateCcw, Shield, ShieldCheck, Sparkles, Volume2, Wind } from 'lucide-react';
import { EmergencyDua, Language } from '../types/index.ts';
import { EMERGENCY_DUAS, RESCUE_ADVICES } from '../data/duas.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';
import confetti from 'canvas-confetti';

interface EmergencySectionProps {
  cleanStreak: number;
  onIncrementCleanStreak: () => void;
  onResetSlip: () => void;
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  cleanStreak,
  onIncrementCleanStreak,
  onResetSlip,
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  // Current active Dua
  const [activeDuaIndex, setActiveDuaIndex] = useState(0);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [survivedUrgesCount, setSurvivedUrgesCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('survived_urges_count');
      return saved ? parseInt(saved, 10) : 3;
    }
    return 3;
  });

  // 5-Minute Urge Surfing Timer State
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breathePhase, setBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  const currentDua: EmergencyDua = EMERGENCY_DUAS[activeDuaIndex];

  // Urge Surfing countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            soundManager.playSuccess(soundEnabled);
            triggerHaptic(50, hapticEnabled);
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, soundEnabled, hapticEnabled]);

  // Breathing cycle animation when timer runs
  useEffect(() => {
    if (!isTimerRunning) return;
    const cycle = setInterval(() => {
      setBreathePhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(cycle);
  }, [isTimerRunning]);

  const handleNextDua = () => {
    triggerHaptic(25, hapticEnabled);
    soundManager.playTap(soundEnabled);
    setActiveDuaIndex((prev) => (prev + 1) % EMERGENCY_DUAS.length);
  };

  const handleSurviveUrge = () => {
    triggerHaptic(40, hapticEnabled);
    soundManager.playSuccess(soundEnabled);
    const newCount = survivedUrgesCount + 1;
    setSurvivedUrgesCount(newCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem('survived_urges_count', newCount.toString());
    }
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(300);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const streakMilestones = [
    { days: 1, label: language === 'urdu' ? 'پہلا دن' : 'Day 1' },
    { days: 3, label: language === 'urdu' ? '3 دن' : '3 Days' },
    { days: 7, label: language === 'urdu' ? 'ایک ہفتہ' : '7 Days' },
    { days: 21, label: language === 'urdu' ? 'عادت کی بحالی' : '21 Days' },
    { days: 40, label: language === 'urdu' ? 'چالیس دن (تزکیہ)' : '40 Days' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Hero Emergency Card */}
      <div className="bg-gradient-to-br from-rose-50 via-white to-orange-50 border-2 border-dashed border-rose-300 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-xs">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>
              {language === 'urdu'
                ? 'ایمرجنسی گارڈ (نفس پر قابو)'
                : language === 'roman-urdu'
                ? 'Emergency Guard (Nafs Control)'
                : 'Emergency Guard (Urge Control)'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-950 tracking-tight">
            {language === 'urdu'
              ? 'جب بھی برا خیال، شہوت یا سستی آئے'
              : language === 'roman-urdu'
              ? 'Jab bhi bura khayal ya susti aaye, yeh button dabayein!'
              : 'When Temptation, Procrastination or Negative Urges Strike'}
          </h2>

          <p className="text-sm text-rose-900/80 max-w-xl mx-auto">
            {language === 'urdu'
              ? 'گناہ کی لذت چند سیکنڈ کی ہے جبکہ پچھتاوا طویل ہے۔ فوری طور پر ذکر و استغفار کا سہارا لیں۔'
              : language === 'roman-urdu'
              ? 'Gunah ki lazzat chand lamhat ki hai jabke pachhtawa lamba hota hai. Foran Astaghfar parhein!'
              : 'The impulse passes quickly, but regret lasts long. Anchor your heart with Istighfar and physical movement.'}
          </p>

          {/* Big Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleNextDua}
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'urdu'
                  ? 'استغفار اور دعا تبدیل کریں'
                  : language === 'roman-urdu'
                  ? 'Astaghfar / Dua Parhein'
                  : 'Read Astaghfar / Next Dua'}
              </span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(20, hapticEnabled);
                setIsTimerRunning((prev) => !prev);
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white border border-rose-200 text-rose-900 hover:bg-rose-50 active:scale-95 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Wind className="w-4 h-4 text-rose-600" />
              <span>
                {isTimerRunning
                  ? 'Pause 5-Min Timer'
                  : language === 'urdu'
                  ? '5 منٹ ضبطِ نفس ٹائمر شروع کریں'
                  : 'Start 5-Min Urge Buster'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Dua Display Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-rose-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'urdu' ? 'مسنون روحانی ڈھال' : 'Spiritual Shield Dua'}
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            {activeDuaIndex + 1} / {EMERGENCY_DUAS.length} · {currentDua.reference}
          </span>
        </div>

        {/* Arabic Calligraphy text */}
        <div className="py-6 text-center">
          <p className="font-arabic text-2xl sm:text-3xl text-emerald-900 leading-loose selection:bg-emerald-200">
            {currentDua.arabic}
          </p>
        </div>

        {/* Transliteration & Translations */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Roman Urdu
            </div>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              "{currentDua.romanUrdu}"
            </p>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide font-urdu">
              اردو ترجمہ
            </div>
            <p className="text-sm text-slate-700 mt-0.5 font-urdu">
              {currentDua.urdu}
            </p>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              English Meaning
            </div>
            <p className="text-xs text-slate-600 mt-0.5 italic">
              {currentDua.english}
            </p>
          </div>
        </div>

        {/* Next Dua trigger */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-rose-800 font-medium">
            💡 {language === 'urdu' ? currentDua.urdu : currentDua.contextRoman}
          </div>
          <button
            onClick={handleNextDua}
            className="flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-rose-50"
          >
            <span>Next Dua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Minute Urge Surfing & Breathing Companion */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold">
              <Wind className="w-3.5 h-3.5" />
              <span>5-Minute Urge Surfing Protocol</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {language === 'urdu'
                ? '5 منٹ صبر کا دائرہ'
                : language === 'roman-urdu'
                ? '5 Min Sabr & Nafs Buster'
                : 'Ride Out the 5-Minute Wave'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'urdu'
                ? 'سائنسی اور روحانی تحقیق کے مطابق شدید خواہش یا سستی صرف 3 سے 5 منٹ زور مارتی ہے۔ اس دوران سانس لیں اور دل میں اللہ کو یاد کریں۔'
                : language === 'roman-urdu'
                ? 'Nafs ki achanak uthne wali talab aam taur par 5 minute me dum tod deti hai. Deep breath lein aur Allah ko yaad karein.'
                : 'Urges peak within 3-5 minutes and then rapidly subside if not fed. Breathe in rhythm with Dhikr.'}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => {
                  triggerHaptic(20, hapticEnabled);
                  setIsTimerRunning((prev) => !prev);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTimerRunning ? 'Pause' : 'Start 5-Min Wave'}</span>
              </button>
              <button
                onClick={handleResetTimer}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Breathing Circle and Timer */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Animated pulsating halo */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  isTimerRunning
                    ? breathePhase === 'Inhale'
                      ? 'scale-110 bg-emerald-500/20'
                      : breathePhase === 'Hold'
                      ? 'scale-105 bg-amber-500/20'
                      : 'scale-90 bg-teal-500/20'
                    : 'bg-slate-800/40'
                }`}
              />
              <div className="w-36 h-36 rounded-full bg-slate-800/90 border border-slate-700 flex flex-col items-center justify-center relative z-10 shadow-inner">
                <span className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 mt-1 uppercase tracking-wider">
                  {isTimerRunning ? (
                    breathePhase === 'Inhale' ? 'Inhale (SubhanAllah)' :
                    breathePhase === 'Hold' ? 'Hold (Alhamdulillah)' :
                    'Exhale (Allahu Akbar)'
                  ) : (
                    'Ready'
                  )}
                </span>
              </div>
            </div>

            {/* Victory Button */}
            <button
              onClick={handleSurviveUrge}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-emerald-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'urdu'
                  ? 'الحمد للہ! میں نے نفس کو زیر کر لیا'
                  : 'Alhamdulillah! I Beat The Urge (+1)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Practical Sunnah Rescue Steps */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {language === 'urdu'
              ? '4 فوری نبوی و عملی اقدامات'
              : language === 'roman-urdu'
              ? '4 Sunnah & Psychological Rescue Steps'
              : '4 Immediate Action Steps to Protect Your Soul'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESCUE_ADVICES.map((adv, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center tabular-nums">
                  0{idx + 1}
                </span>
                <h4 className="text-sm font-semibold text-slate-900">
                  {language === 'urdu' ? adv.titleUrdu : adv.titleRoman}
                </h4>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {language === 'urdu' ? adv.descUrdu : adv.descRoman}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Days Streak & Compassionate Reset */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {language === 'urdu'
                  ? 'پاکیزگی اور استقامت کا تسلسل'
                  : language === 'roman-urdu'
                  ? 'Clean Days Streak (Pakizgi)'
                  : 'Purity & Discipline Streak'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'urdu'
                ? 'ہر دن ایک فتح ہے۔ استقامت ہی ایمان کی اصل روح ہے۔'
                : 'Har din burai se bache rehna aakhirat ki kamyabi hai.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {cleanStreak} <span className="text-xs font-medium text-slate-500">Days</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                {survivedUrgesCount} urges defeated
              </div>
            </div>
          </div>
        </div>

        {/* Milestones row */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          {streakMilestones.map((m) => {
            const reached = cleanStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  reached
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="text-sm font-bold tabular-nums">{m.days}d</div>
                <div className="text-[10px] truncate mt-0.5">{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* Reset Slip / Taubah trigger */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {language === 'urdu'
              ? 'اگر خطا ہو جائے تو مایوس نہ ہوں، توبہ کا دروازہ کھلا ہے۔'
              : 'Agar ghalti ho jaye toh mayoos na hon; foran Taubah karein.'}
          </span>
          <button
            onClick={() => setShowSlipModal(true)}
            className="text-xs font-semibold text-slate-600 hover:text-rose-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
          >
            {language === 'urdu' ? 'لغزش درج کریں اور توبہ کریں' : 'Record Slip & Taubah'}
          </button>
        </div>
      </div>

      {/* Slip & Taubah Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <Heart className="w-6 h-6 text-rose-500" />
              <h4 className="text-lg font-bold text-slate-900">
                {language === 'urdu' ? 'مایوسی کفر ہے — سچی توبہ' : 'Never Despair — Sachi Taubah'}
              </h4>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-semibold">
                ”كُلُّ ابْنِ آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ“
              </p>
              <p className="italic text-emerald-800">
                "Every child of Adam makes mistakes, and the best of those who make mistakes are those who repent." (Tirmidhi)
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'urdu'
                ? 'گر کر کھڑے ہونا ہی مومن کا شیوہ ہے۔ ابھی وضو کریں، دو رکعت صلوٰۃ التوبہ پڑھیں اور نئے عزم کے ساتھ آگے بڑھیں۔'
                : 'Agar slip hua hai toh Shaitan chahta hai ke aap mayoos ho kar aur buraai karein. Mayoos na hon! Abhi wuzu karein aur naye azam se safar shuru karein.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(30, hapticEnabled);
                  onResetSlip();
                  setShowSlipModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
              >
                Reset Streak & Start Fresh (Bismillah)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
