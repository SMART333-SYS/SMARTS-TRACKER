import { AppState, DailyLog, HabitItem, WorkoutRecord } from '../types/index.ts';
import { DEFAULT_HABITS } from '../data/duas.ts';
import { getTodayKey, shiftDateKey } from './date.ts';

const STORAGE_KEY = 'islami_fitness_app_v1';

export const getInitialDailyLog = (dateKey: string): DailyLog => ({
  date: dateKey,
  habitsCompleted: [],
  prayers: {
    fajr: 'pending',
    dhuhr: 'pending',
    asr: 'pending',
    maghrib: 'pending',
    isha: 'pending'
  },
  nawafilCompleted: [],
  waterGlasses: 0,
  notes: ''
});

export const getDefaultAppState = (): AppState => {
  const today = getTodayKey();
  const yesterday = shiftDateKey(today, -1);

  // Provide initial sensible demonstration records so user sees realistic state
  const initialWorkouts: WorkoutRecord[] = [
    {
      id: 'demo_workout_1',
      date: yesterday,
      timestamp: Date.now() - 86400000,
      title: 'Chest & Triceps',
      category: 'Chest',
      durationMinutes: 45,
      notes: '3 sets Bench Press (60kg x 10), 3 sets Incline DB Press, 3 sets Tricep Pushdowns. Alhamdullilah strong energy.',
      exercises: [
        { id: 'ex_1', exercise: 'Bench Press', sets: 3, reps: 10, weightKg: 60 },
        { id: 'ex_2', exercise: 'Incline Dumbbell Press', sets: 3, reps: 12, weightKg: 20 },
        { id: 'ex_3', exercise: 'Tricep Rope Pushdown', sets: 3, reps: 15, weightKg: 25 }
      ],
      feeling: 'good',
      bismillahCheck: true
    }
  ];

  return {
    language: 'roman-urdu', // Matching user's initial prompt language
    dailyLogs: {
      [today]: getInitialDailyLog(today),
      [yesterday]: {
        date: yesterday,
        habitsCompleted: ['habit_early_rise', 'habit_quran', 'habit_work_skills'],
        prayers: {
          fajr: 'jamaat',
          dhuhr: 'on_time',
          asr: 'on_time',
          maghrib: 'jamaat',
          isha: 'on_time'
        },
        nawafilCompleted: ['tahajjud', 'witr'],
        waterGlasses: 7,
        notes: 'Good disciplined day.'
      }
    },
    customHabits: [],
    workouts: initialWorkouts,
    cleanDaysStreak: 7, // 7 days pure streak
    lastSlipDate: null,
    tasbeehCounts: {
      astaghfirullah: 33,
      subhanallah: 33,
      alhamdulillah: 33,
      allahu_akbar: 34,
      durood: 10
    },
    selectedDate: today,
    soundEnabled: true,
    hapticEnabled: true
  };
};

export const loadAppState = (): AppState => {
  if (typeof window === 'undefined') return getDefaultAppState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultAppState();
    const parsed = JSON.parse(raw);
    const today = getTodayKey();

    // Ensure today's log exists
    if (!parsed.dailyLogs[today]) {
      parsed.dailyLogs[today] = getInitialDailyLog(today);
    }
    if (!parsed.selectedDate) {
      parsed.selectedDate = today;
    }
    return { ...getDefaultAppState(), ...parsed };
  } catch (err) {
    console.error('Failed to load local state:', err);
    return getDefaultAppState();
  }
};

export const saveAppState = (state: AppState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist app state:', err);
  }
};
