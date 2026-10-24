import React, { useState, useMemo } from 'react';
import {
  Award,
  BarChart3,
  Calendar,
  Check,
  Clock,
  Droplets,
  Dumbbell,
  Flame,
  Music,
  Plus,
  Radio,
  Sparkles,
  Timer,
  Trash2,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { ExerciseSet, Language, MusicTrack, WorkoutRecord } from '../types/index.ts';
import { ISLAMIC_FITNESS_WISDOM } from '../data/duas.ts';
import { getTodayKey, shiftDateKey } from '../utils/date.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';
import { ExerciseTimer } from './ExerciseTimer.tsx';
import { WorkoutMusicPlayer, WORKOUT_TRACKS } from './WorkoutMusicPlayer.tsx';
import confetti from 'canvas-confetti';

interface CustomWorkoutTooltipProps {
  active?: boolean;
  payload?: any[];
  language: Language;
}

const CustomWorkoutTooltip: React.FC<CustomWorkoutTooltipProps> = ({ active, payload, language }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-2xl p-3 shadow-2xl border border-slate-700/80 min-w-[170px] z-50">
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
          <span className="font-bold text-slate-200">{data.fullDayName}</span>
          {data.isToday && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {language === 'urdu' ? 'آج' : 'Today'}
            </span>
          )}
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {language === 'urdu' ? 'ورزشیں:' : 'Workouts:'}
            </span>
            <span className="font-black text-orange-400 tabular-nums">
              {data.count} {language === 'urdu' ? 'ورزش' : data.count === 1 ? 'Workout' : 'Workouts'}
            </span>
          </div>
          {data.durationMinutes > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {language === 'urdu' ? 'کل وقت:' : 'Duration:'}
              </span>
              <span className="font-bold text-slate-200 tabular-nums">
                {data.durationMinutes} {language === 'urdu' ? 'منٹ' : 'mins'}
              </span>
            </div>
          )}
        </div>
        {data.categories && data.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-slate-800/80">
            {data.categories.map((cat: string) => (
              <span
                key={cat}
                className="px-1.5 py-0.5 rounded text-[9px] bg-orange-500/20 text-orange-300 border border-orange-500/30 font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface GymSectionProps {
  workouts: WorkoutRecord[];
  onAddWorkout: (workout: Omit<WorkoutRecord, 'id' | 'timestamp'>) => void;
  onDeleteWorkout: (id: string) => void;
  waterGlasses: number;
  onUpdateWater: (count: number) => void;
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const GymSection: React.FC<GymSectionProps> = ({
  workouts,
  onAddWorkout,
  onDeleteWorkout,
  waterGlasses,
  onUpdateWater,
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  const [activeGymSubTab, setActiveGymSubTab] = useState<'log' | 'timer' | 'music'>('log');
  const [workoutName, setWorkoutName] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [category, setCategory] = useState<WorkoutRecord['category']>('Chest');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [bismillahCheck, setBismillahCheck] = useState(true);
  const [feeling, setFeeling] = useState<WorkoutRecord['feeling']>('good');

  // Compute past 7 days of workout activity for Recharts Bar Chart
  const pastWeekData = useMemo(() => {
    const today = getTodayKey();
    const days: Array<{
      dateKey: string;
      dayLabel: string;
      fullDayName: string;
      count: number;
      durationMinutes: number;
      categories: string[];
      isToday: boolean;
    }> = [];

    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNamesUrdu = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
    const dayNamesRoman = ['Itwar', 'Peer', 'Mangal', 'Budh', 'Jumeraat', 'Jummah', 'Hafta'];

    const fullDayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const fullDayNamesUrdu = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
    const fullDayNamesRoman = ['Itwar', 'Peer', 'Mangal', 'Budh', 'Jumeraat', 'Jummah', 'Hafta'];

    // Past 7 days: from 6 days ago up to today (0)
    for (let i = 6; i >= 0; i--) {
      const dKey = shiftDateKey(today, -i);
      const [year, month, day] = dKey.split('-').map(Number);
      const dObj = new Date(year, month - 1, day);
      const dayOfWeek = dObj.getDay();

      const shortLabel =
        language === 'urdu'
          ? dayNamesUrdu[dayOfWeek]
          : language === 'roman-urdu'
          ? dayNamesRoman[dayOfWeek]
          : dayNamesEn[dayOfWeek];

      const fullLabel =
        language === 'urdu'
          ? fullDayNamesUrdu[dayOfWeek]
          : language === 'roman-urdu'
          ? fullDayNamesRoman[dayOfWeek]
          : fullDayNamesEn[dayOfWeek];

      const dayWorkouts = workouts.filter((w) => w.date === dKey);
      const totalMins = dayWorkouts.reduce((acc, w) => acc + (Number(w.durationMinutes) || 0), 0);
      const cats = Array.from(new Set(dayWorkouts.map((w) => w.category)));

      days.push({
        dateKey: dKey,
        dayLabel: i === 0 ? (language === 'urdu' ? 'آج' : language === 'roman-urdu' ? 'Aaj' : 'Today') : shortLabel,
        fullDayName: `${fullLabel} (${day} ${dObj.toLocaleString('en', { month: 'short' })})`,
        count: dayWorkouts.length,
        durationMinutes: totalMins,
        categories: cats,
        isToday: i === 0,
      });
    }

    return days;
  }, [workouts, language]);

  const totalWeekWorkouts = useMemo(
    () => pastWeekData.reduce((sum, d) => sum + d.count, 0),
    [pastWeekData]
  );
  const totalWeekMinutes = useMemo(
    () => pastWeekData.reduce((sum, d) => sum + d.durationMinutes, 0),
    [pastWeekData]
  );
  const activeWorkoutDays = useMemo(
    () => pastWeekData.filter((d) => d.count > 0).length,
    [pastWeekData]
  );
  const [attachedMusic, setAttachedMusic] = useState<MusicTrack | null>(WORKOUT_TRACKS[0]);

  // Structured exercises list
  const [exercises, setExercises] = useState<ExerciseSet[]>([
    { id: '1', exercise: 'Bench Press / Pushups', sets: 3, reps: 10, weightKg: 50 },
  ]);

  const categories: WorkoutRecord['category'][] = [
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Full Body',
    'Cardio',
    'Home Workout',
  ];

  const presets = [
    {
      title: 'Chest & Triceps (Push)',
      cat: 'Chest' as const,
      notes: 'Bench Press 3x10, Incline DB Press 3x12, Tricep Dips 3x12',
      exercises: [
        { id: 'p1', exercise: 'Flat Bench Press', sets: 3, reps: 10, weightKg: 60 },
        { id: 'p2', exercise: 'Incline Dumbbell Press', sets: 3, reps: 12, weightKg: 20 },
        { id: 'p3', exercise: 'Tricep Rope Pushdowns', sets: 3, reps: 15, weightKg: 25 },
      ],
    },
    {
      title: 'Back & Biceps (Pull)',
      cat: 'Back' as const,
      notes: 'Lat Pulldown 3x12, Barbell Rows 3x10, Bicep DB Curls 3x12',
      exercises: [
        { id: 'p4', exercise: 'Lat Pulldowns', sets: 3, reps: 12, weightKg: 55 },
        { id: 'p5', exercise: 'Barbell Bent-Over Row', sets: 3, reps: 10, weightKg: 50 },
        { id: 'p6', exercise: 'Bicep Dumbbell Curls', sets: 3, reps: 12, weightKg: 14 },
      ],
    },
    {
      title: 'Legs & Core',
      cat: 'Legs' as const,
      notes: 'Squats 4x10, Romanian Deadlifts 3x10, Planks 3x60s',
      exercises: [
        { id: 'p7', exercise: 'Barbell Squats', sets: 4, reps: 10, weightKg: 70 },
        { id: 'p8', exercise: 'Leg Press', sets: 3, reps: 12, weightKg: 120 },
      ],
    },
    {
      title: 'Sunnah Cardio & Stamina',
      cat: 'Cardio' as const,
      notes: 'Brisk Walk / Jogging 30 mins, Pushups 50 total reps',
      exercises: [
        { id: 'p9', exercise: 'Outdoor Jog / Treadmill', sets: 1, reps: 30, weightKg: 0 },
      ],
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    triggerHaptic(20, hapticEnabled);
    setWorkoutName(preset.title);
    setCategory(preset.cat);
    setWorkoutNotes(preset.notes);
    setExercises(preset.exercises);
  };

  const handleAddExerciseRow = () => {
    setExercises((prev) => [
      ...prev,
      { id: Date.now().toString(), exercise: '', sets: 3, reps: 10, weightKg: 0 },
    ]);
  };

  const handleRemoveExerciseRow = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateExerciseRow = (id: string, field: keyof ExerciseSet, value: string | number) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName.trim()) {
      alert(language === 'urdu' ? 'براہ کرم پہلے ورزش کا نام درج کریں!' : 'Pehle workout ka naam toh likhein!');
      return;
    }

    triggerHaptic(40, hapticEnabled);
    soundManager.playSuccess(soundEnabled);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onAddWorkout({
      date: getTodayKey(),
      title: workoutName.trim(),
      category,
      durationMinutes: Number(durationMinutes) || 45,
      notes: workoutNotes.trim(),
      exercises: exercises.filter((e) => e.exercise.trim().length > 0),
      feeling,
      bismillahCheck,
      songTrack: attachedMusic ? `${attachedMusic.title} (${attachedMusic.bpm} BPM)` : undefined,
      songBpm: attachedMusic?.bpm,
      songMood: attachedMusic?.genre,
    });

    // Reset inputs
    setWorkoutName('');
    setWorkoutNotes('');
    setExercises([{ id: '1', exercise: '', sets: 3, reps: 10, weightKg: 0 }]);
  };

  const handleWaterClick = (delta: number) => {
    triggerHaptic(15, hapticEnabled);
    soundManager.playTap(soundEnabled);
    const newGlasses = Math.max(0, Math.min(16, waterGlasses + delta));
    onUpdateWater(newGlasses);
  };

  return (
    <div className="space-y-6">
      {/* Islamic Fitness Philosophy Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'urdu'
                  ? 'حدیث نبوی: قوی اور طاقتور مومن'
                  : 'Sunnah Fitness Philosophy'}
              </span>
            </div>
            <p className="font-arabic text-xl sm:text-2xl text-emerald-100 leading-relaxed">
              ”الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ“
            </p>
            <p className="text-xs text-slate-300 max-w-xl">
              {language === 'urdu'
                ? 'طاقتور مومن، کمزور مومن سے بہتر اور اللہ کو زیادہ محبوب ہے۔ (صحیح مسلم)'
                : language === 'roman-urdu'
                ? 'Taaqatwar momin, kamzor momin se behtar aur Allah ko zyada mehboob hai. (Sahih Muslim 2664)'
                : 'The strong believer is better and more beloved to Allah than the weak believer, while there is good in both. (Sahih Muslim)'}
            </p>
          </div>
          <div className="shrink-0 bg-emerald-900/80 px-3.5 py-2 rounded-xl border border-emerald-700/50 text-center">
            <span className="text-[11px] text-emerald-300 block font-medium">Bismillah Intention</span>
            <span className="text-xs text-white font-bold">Ibadat ke liye Taqat</span>
          </div>
        </div>
      </div>

      {/* Gym Portal Sub-Navigation: Log Workout | Exercise Timer | Music Station */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl w-full max-w-lg shadow-inner border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(15, hapticEnabled);
              setActiveGymSubTab('log');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 ${
              activeGymSubTab === 'log'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>{language === 'urdu' ? 'ورزش لاگ' : 'Workout Log'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(15, hapticEnabled);
              setActiveGymSubTab('timer');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 ${
              activeGymSubTab === 'timer'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{language === 'urdu' ? 'ورزش ٹائمر' : 'Exercise Timer'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(15, hapticEnabled);
              setActiveGymSubTab('music');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 ${
              activeGymSubTab === 'music'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{language === 'urdu' ? 'میوزک و میش اپ' : 'Music & Mashup'}</span>
          </button>
        </div>
      </div>

      {/* --- SUB TAB 2: EXERCISE TIMER --- */}
      {activeGymSubTab === 'timer' && (
        <ExerciseTimer
          language={language}
          soundEnabled={soundEnabled}
          hapticEnabled={hapticEnabled}
        />
      )}

      {/* --- SUB TAB 3: WORKOUT MUSIC PLAYER & MASHUP STATION --- */}
      {activeGymSubTab === 'music' && (
        <WorkoutMusicPlayer
          language={language}
          soundEnabled={soundEnabled}
          hapticEnabled={hapticEnabled}
          selectedTrackTitle={attachedMusic?.title || ''}
          onSelectTrackForWorkout={(track) => setAttachedMusic(track)}
        />
      )}

      {/* --- SUB TAB 1: WORKOUT LOG FORM --- */}
      {activeGymSubTab === 'log' && (
        <>
          {/* Quick Bar: Attached Music & Quick Timer shortcut */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Music className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="text-slate-500 font-medium">Workout Sound: </span>
                <strong className="text-slate-900">
                  {attachedMusic ? `${attachedMusic.title} (${attachedMusic.bpm} BPM)` : 'None'}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveGymSubTab('music')}
                className="text-emerald-700 hover:text-emerald-800 font-semibold underline"
              >
                Change Mashup
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setActiveGymSubTab('timer')}
                className="text-slate-700 hover:text-slate-900 font-semibold underline flex items-center gap-1"
              >
                <Timer className="w-3 h-3" />
                <span>Open Timer</span>
              </button>
            </div>
          </div>

          {/* Main Gym Entry Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>💪</span>
                <span>
                  {language === 'urdu'
                    ? 'ورزش و جم لاگ'
                    : language === 'roman-urdu'
                    ? 'Gym & Fitness Portal'
                    : 'Gym & Fitness Portal'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'urdu'
                  ? 'آج کی ورزش، سیٹس، ریپس، وزن اور میوزک میش اپ کا مکمل ریکارڈ محفوظ کریں۔'
                  : 'Aaj ka workout, sets, reps, weights aur music track ka record darj karein.'}
              </p>
            </div>

            {/* Quick Workout Templates */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                {language === 'urdu' ? 'فوری ٹیمپلیٹس منتخب کریں:' : 'Quick Workout Presets:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all text-xs"
                  >
                    <div className="font-semibold text-slate-800">{p.title}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.cat}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Workout Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'urdu' ? 'آج کی ورزش کا عنوان:' : 'Aaj ka Workout:'}
                </label>
                <input
                  type="text"
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Misal ke taur par: Chest & Triceps"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'urdu' ? 'مسل گروپ / کیٹیگری:' : 'Muscle Group / Category:'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WorkoutRecord['category'])}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'urdu' ? 'دورانیہ (منٹ):' : 'Duration (Minutes):'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Structured Exercises Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {language === 'urdu' ? 'سیٹس، ریپس اور ویٹ (اختیاری تفصیل):' : 'Sets, Reps & Weights breakdown:'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddExerciseRow}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Exercise</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {exercises.map((ex) => (
                    <div key={ex.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ex.exercise}
                        onChange={(e) => handleUpdateExerciseRow(ex.id, 'exercise', e.target.value)}
                        placeholder="Exercise (e.g. Incline Bench)"
                        className="flex-2 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => handleUpdateExerciseRow(ex.id, 'sets', Number(e.target.value))}
                          placeholder="Sets"
                          className="w-14 px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-center"
                        />
                        <span className="text-slate-400 text-xs">x</span>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => handleUpdateExerciseRow(ex.id, 'reps', Number(e.target.value))}
                          placeholder="Reps"
                          className="w-14 px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={ex.weightKg || ''}
                          onChange={(e) => handleUpdateExerciseRow(ex.id, 'weightKg', Number(e.target.value))}
                          placeholder="kg"
                          className="w-16 px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-center"
                        />
                        <span className="text-[11px] text-slate-400">kg</span>
                      </div>
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseRow(ex.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Input (Matching Prompt) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'urdu' ? 'نوٹس / پیش رفت کا خلاصہ:' : 'Weight / Progress Notes:'}
                </label>
                <input
                  type="text"
                  id="workout-notes"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="Sets, Reps aur Weights ka record likhein"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Sunnah Bismillah & Feeling */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={bismillahCheck}
                    onChange={(e) => setBismillahCheck(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>
                    {language === 'urdu'
                      ? 'بسم اللہ کے ساتھ عبادت اور صحت کی نیت سے آغاز کیا'
                      : 'Bismillah ke sath deeni o jismani taqat ki niyat'}
                  </span>
                </label>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500">Feeling:</span>
                  {(['energetic', 'good', 'tired'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFeeling(f)}
                      className={`px-2 py-1 rounded-md capitalize transition-colors ${
                        feeling === f
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Workout Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 min-h-[48px]"
              >
                <Dumbbell className="w-4 h-4" />
                <span>
                  {language === 'urdu' ? 'ورزش ریکارڈ محفوظ کریں' : 'Workout Save Karein'}
                </span>
              </button>
            </form>
          </div>

          {/* Weekly Workout Activity Recharts Bar Chart */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md shadow-slate-100/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{language === 'urdu' ? 'گزشتہ ۱ ہفتے کی ورزشیں (ہفتہ وار چارٹ)' : language === 'roman-urdu' ? 'Pichle 1 Hafte Ka Workout Chart' : 'Past Week Workout Activity'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'urdu'
                      ? 'گزشتہ ۷ دنوں میں روزانہ کی جانے والی ورزشوں کی تعداد اور وقت کا جائزہ'
                      : 'Number of workouts performed each day over the past 7 days'}
                  </p>
                </div>
              </div>

              {/* Weekly Summary Stat Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 text-xs font-bold">
                  <span className="text-orange-600 font-extrabold">{totalWeekWorkouts}</span>{' '}
                  <span>{language === 'urdu' ? 'ورزشیں' : totalWeekWorkouts === 1 ? 'Workout' : 'Workouts'}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold">
                  <span className="text-emerald-600 font-extrabold">{totalWeekMinutes}</span>{' '}
                  <span>{language === 'urdu' ? 'منٹ' : 'Mins'}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                  <span className="font-extrabold text-slate-900">{activeWorkoutDays}</span>/7{' '}
                  <span>{language === 'urdu' ? 'دن ایکٹو' : 'Days Active'}</span>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart Container */}
            <div className="w-full h-64 min-h-[250px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pastWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="workoutBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity={0.75} />
                    </linearGradient>
                    <linearGradient id="todayBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.75} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="dayLabel"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                  />
                  <Tooltip
                    content={<CustomWorkoutTooltip language={language} />}
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                    minPointSize={4}
                  >
                    {pastWeekData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isToday ? 'url(#todayBarGradient)' : 'url(#workoutBarGradient)'}
                        stroke={entry.isToday ? '#059669' : '#ea580c'}
                        strokeWidth={entry.count > 0 ? 1 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Insight Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'urdu'
                    ? 'سبز بار آج کے دن کی نمائندگی کرتا ہے اور نارنجی بارز گزشتہ دنوں کی ہیں۔'
                    : 'Green bar indicates today; orange bars represent previous days in the past week.'}
                </span>
              </div>
              <span className="font-semibold text-slate-600">
                {language === 'urdu' ? 'قوی جسم = عبادت میں توانائی' : 'Consistent Exercise = Energy for Ibadah'}
              </span>
            </div>
          </div>

          {/* Sunnah Water Hydration Tracker */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {language === 'urdu' ? 'پانی پینے کا مسنون ٹریکر' : 'Sunnah Hydration (Water Tracker)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'urdu'
                      ? 'بیٹھ کر، دائیں ہاتھ سے، 3 گھونٹ میں پانی پینا مسنون ہے۔'
                      : 'Baith kar, daayein haath se, 3 ghoont me paani peena Sunnah hai.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    {waterGlasses} <span className="text-xs text-slate-500 font-normal">/ 8 Glasses</span>
                  </span>
                  <span className="block text-[11px] text-blue-600 font-semibold tabular-nums">
                    {(waterGlasses * 0.25).toFixed(1)} Liters
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleWaterClick(-1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWaterClick(1)}
                    className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 8 Glasses visual indicators */}
            <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {Array.from({ length: 8 }).map((_, idx) => {
                const filled = idx < waterGlasses;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleWaterClick(filled ? -1 : 1)}
                    className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
                      filled
                        ? 'bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-300 scale-[1.03]'
                        : 'bg-slate-100/80 hover:bg-slate-200 text-slate-400 border border-slate-200/80'
                    }`}
                    title={`Glass ${idx + 1}`}
                  >
                    <Droplets className={`w-5 h-5 ${filled ? 'fill-current animate-bounce' : ''}`} />
                    <span className="text-[10px] font-bold mt-1">Glass {idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workout History / Record List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>🏋️</span>
                <span>{language === 'urdu' ? 'آپ کا ریکارڈ و تاریخ:' : 'Aapka Record:'}</span>
              </h3>
              <span className="text-xs text-slate-400 tabular-nums">
                {workouts.length} {language === 'urdu' ? 'ورزشیں' : 'Workouts Logged'}
              </span>
            </div>

            {workouts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                {language === 'urdu'
                  ? 'ابھی تک کوئی ریکارڈ موجود نہیں۔ اوپر فارم سے ورزش درج کریں!'
                  : 'Abhi tak koi workout record nahi. Upar se pehla workout add karein!'}
              </div>
            ) : (
              <ul id="workout-history" className="mt-4 space-y-3">
                {workouts.map((record) => (
                  <li
                    key={record.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">
                            {record.title}
                          </span>
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                            {record.category}
                          </span>
                          {record.bismillahCheck && (
                            <span className="text-[10px] text-slate-500 font-arabic">
                              (بِسْمِ اللَّهِ)
                            </span>
                          )}
                          {record.songTrack && (
                            <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                              <Music className="w-3 h-3 text-indigo-600" />
                              <span>{record.songTrack}</span>
                            </span>
                          )}
                        </div>

                        {record.notes && (
                          <p className="text-xs text-slate-600 mt-1">
                            <strong className="text-slate-700">Notes: </strong>
                            {record.notes}
                          </p>
                        )}

                        {record.exercises && record.exercises.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                            {record.exercises.map((ex) => (
                              <span
                                key={ex.id}
                                className="bg-white px-2 py-0.5 rounded border border-slate-200"
                              >
                                {ex.exercise}: {ex.sets}x{ex.reps} {ex.weightKg ? `(${ex.weightKg}kg)` : ''}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {record.date}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {record.durationMinutes} mins
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteWorkout(record.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};
