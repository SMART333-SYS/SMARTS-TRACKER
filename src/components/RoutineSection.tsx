import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Sparkles, Trash2, BookOpen, Clock, HeartHandshake, Dumbbell, Award, Flame } from 'lucide-react';
import { DailyLog, HabitItem, Language } from '../types/index.ts';
import { DEFAULT_HABITS } from '../data/duas.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';
import confetti from 'canvas-confetti';

interface RoutineSectionProps {
  currentLog: DailyLog;
  onToggleHabit: (habitId: string) => void;
  customHabits: HabitItem[];
  onAddCustomHabit: (title: string, category: 'spiritual' | 'work' | 'health' | 'mindset') => void;
  onDeleteCustomHabit: (habitId: string) => void;
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const RoutineSection: React.FC<RoutineSectionProps> = ({
  currentLog,
  onToggleHabit,
  customHabits,
  onAddCustomHabit,
  onDeleteCustomHabit,
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'spiritual' | 'work' | 'health' | 'mindset'>('spiritual');
  const [showAddForm, setShowAddForm] = useState(false);

  const allHabits = [...DEFAULT_HABITS, ...customHabits];
  const completedCount = allHabits.filter((h) => currentLog.habitsCompleted.includes(h.id)).length;
  const totalCount = allHabits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (habitId: string) => {
    triggerHaptic(20, hapticEnabled);
    const willBeComplete = !currentLog.habitsCompleted.includes(habitId);

    if (willBeComplete) {
      soundManager.playTap(soundEnabled);
      // If completed 100%, fire celebration
      if (completedCount + 1 === totalCount) {
        soundManager.playSuccess(soundEnabled);
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'],
        });
      }
    }
    onToggleHabit(habitId);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCustomHabit(newTitle.trim(), newCategory);
    setNewTitle('');
    setShowAddForm(false);
  };

  const getHabitTitle = (h: HabitItem) => {
    if (h.isCustom) return h.titleRoman;
    if (language === 'urdu') return h.titleUrdu;
    if (language === 'english') return h.titleEn;
    return h.titleRoman;
  };

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case 'spiritual':
        return {
          icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
          label: language === 'urdu' ? 'روحانی' : 'Spiritual',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          activeBg: 'bg-emerald-500/10 border-emerald-300',
        };
      case 'work':
        return {
          icon: <Clock className="w-4 h-4 text-sky-600" />,
          label: language === 'urdu' ? 'کام / فوکس' : 'Focus',
          badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
          activeBg: 'bg-sky-500/10 border-sky-300',
        };
      case 'health':
        return {
          icon: <Dumbbell className="w-4 h-4 text-orange-600" />,
          label: language === 'urdu' ? 'صحت / ورزش' : 'Fitness',
          badgeClass: 'bg-orange-50 text-orange-800 border-orange-200/80',
          activeBg: 'bg-orange-500/10 border-orange-300',
        };
      default:
        return {
          icon: <HeartHandshake className="w-4 h-4 text-purple-600" />,
          label: language === 'urdu' ? 'تربیت' : 'Mindset',
          badgeClass: 'bg-purple-50 text-purple-800 border-purple-200/80',
          activeBg: 'bg-purple-500/10 border-purple-300',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Dynamic Progress Banner */}
      <div className="bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 rounded-3xl p-6 border border-emerald-500/20 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'urdu' ? 'روزانہ کی استقامت' : 'Daily Consistency Tracker'}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📅</span>
              <span>
                {language === 'urdu'
                  ? 'روزانہ کا معمول و روٹین'
                  : language === 'roman-urdu'
                  ? 'Rozana ka Routine'
                  : 'Daily Routine & Disciplines'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
              {language === 'urdu'
                ? 'فجر سے عشاء تک اپنی روزمرہ عادات کا جائزہ لیں اور روحانی و جسمانی نظم پیدا کریں۔'
                : language === 'roman-urdu'
                ? 'Subah se raat tak roohani aur jismani kamyabi ka rozana hisaab.'
                : 'Track and build spiritual and physical daily habits consistently.'}
            </p>
          </div>

          {/* Progress Ring & Score Box */}
          <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-200/80 shadow-md shadow-emerald-500/5 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-semibold">
                {language === 'urdu' ? 'آج کی تکمیل' : language === 'roman-urdu' ? 'Aaj ka Score' : "Today's Score"}
              </div>
              <div className="text-xl font-black text-slate-900 tabular-nums">
                {completedCount}{' '}
                <span className="text-xs text-slate-400 font-medium">/ {totalCount}</span>
              </div>
            </div>
            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-800 tabular-nums">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar under header */}
        <div className="mt-4">
          <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <div className="mt-2 text-center text-xs font-bold text-emerald-700 animate-pulse">
              🎉 ماشاءاللہ! آج کے تمام معمولات مکمل ہو چکے ہیں!
            </div>
          )}
        </div>

        {/* Habits Checklist */}
        <div className="mt-6 space-y-3">
          {allHabits.map((habit) => {
            const isCompleted = currentLog.habitsCompleted.includes(habit.id);
            const catDetails = getCategoryDetails(habit.category);

            return (
              <div
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                  isCompleted
                    ? 'bg-emerald-50/90 border-emerald-300/80 text-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200/90 text-slate-800 shadow-xs hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    className="shrink-0 focus:outline-hidden transition-transform group-active:scale-90"
                    aria-label={`Toggle ${habit.titleRoman}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    )}
                  </button>
                  <div className="truncate">
                    <span
                      className={`text-sm sm:text-base font-semibold block truncate transition-all ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                      } ${language === 'urdu' ? 'font-urdu' : ''}`}
                    >
                      {getHabitTitle(habit)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${catDetails.badgeClass}`}
                  >
                    {catDetails.icon}
                    <span className="hidden sm:inline">{catDetails.label}</span>
                  </span>
                  {habit.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomHabit(habit.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Custom Habit Toggle & Form */}
        <div className="mt-6 pt-5 border-t border-slate-200/80">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 py-2 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 transition-colors shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>
                {language === 'urdu'
                  ? 'نیا روزمرہ کا کام شامل کریں (+)'
                  : language === 'roman-urdu'
                  ? 'Naya Habit / Task Shamil Karein (+)'
                  : 'Add New Custom Habit (+)'}
              </span>
            </button>
          ) : (
            <form onSubmit={handleAddSubmit} className="space-y-3.5 bg-white p-5 rounded-2xl border border-emerald-200 shadow-md">
              <div className="text-xs font-bold text-slate-800">
                {language === 'urdu' ? 'نیا معمول شامل کریں' : 'Naya Habit / Goal'}
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={
                  language === 'urdu'
                    ? 'مثلاً: شام کو 15 منٹ دینی کتاب کا مطالعہ'
                    : 'Misal: Shaam ko 15 min book reading ya walk'
                }
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                autoFocus
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Category:</span>
                  {(['spiritual', 'work', 'health', 'mindset'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg capitalize font-bold text-xs transition-colors ${
                        newCategory === cat
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
                  >
                    Save Habit
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 2. Sunnah Disciplines Box (Vibrant, Stylish Islamic Card) */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'urdu' ? 'روزمرہ مسنون برکات' : 'Sunnah Daily Mindset'}</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-emerald-100 leading-relaxed">
              {language === 'urdu'
                ? '”مسواک، کھانے سے پہلے ہاتھ دھونا، سیدھے ہاتھ سے کھانا اور دائیں کروٹ سونا۔“'
                : language === 'roman-urdu'
                ? '"Miswak, har kaam se pehle Bismillah, aur daayi (right) karwat sona barkat ka zariya hai."'
                : '"Starting every task with Bismillah, maintaining Wudu, and sleeping on your right side brings immense Barakah."'}
            </p>
          </div>
          <div className="shrink-0 text-amber-300/90 text-xs font-mono font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            Al-Adab al-Mufrad
          </div>
        </div>
      </div>
    </div>
  );
};
