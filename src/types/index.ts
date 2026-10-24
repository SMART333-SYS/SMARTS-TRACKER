export type Language = 'roman-urdu' | 'urdu' | 'english';

export type TabType = 'routine' | 'namaz' | 'quran' | 'dua' | 'gym' | 'timer' | 'youtube' | 'tasbeeh' | 'safety' | 'install' | 'music' | 'audioplayer';

export interface QuranSurahMeta {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  englishTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  urduName: string;
  juzStart: number;
}

export interface QuranAyah {
  numberInSurah: number;
  textArabic: string;
  translationUrdu: string;
  translationEnglish: string;
  audioUrl?: string;
}

export interface QuranReciter {
  id: string;
  name: string;
  arabicName: string;
  country: string;
  serverUrl: string;
  fallbackServerUrl?: string;
  ayahReciterId?: string;
  styleDescription: string;
}

export interface QuranOfflineSurah {
  surahNumber: number;
  reciterId: string;
  size: number;
  downloadedAt: number;
}


export interface HabitItem {
  id: string;
  titleRoman: string;
  titleUrdu: string;
  titleEn: string;
  category: 'spiritual' | 'work' | 'health' | 'mindset';
  isCustom?: boolean;
}

export type PrayerStatus = 'pending' | 'jamaat' | 'on_time' | 'qaza' | 'missed';

export interface PrayerItem {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameRoman: string;
  nameUrdu: string;
  nameEn: string;
  arabicName: string;
  defaultTime: string;
  fardRakat: number;
  sunnahRakat: number;
}

export interface NaflPrayer {
  id: 'tahajjud' | 'ishraq' | 'chasht' | 'awwabin' | 'witr';
  nameRoman: string;
  nameUrdu: string;
  nameEn: string;
}

export interface ExerciseSet {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Full Body' | 'Cardio' | 'Home Workout' | 'Other';
  durationMinutes: number;
  notes: string;
  exercises: ExerciseSet[];
  feeling: 'energetic' | 'good' | 'tired' | 'challenging';
  bismillahCheck: boolean;
  songTrack?: string;
  songBpm?: number;
  songMood?: string;
}

export interface EmergencyDua {
  id: string;
  arabic: string;
  romanUrdu: string;
  urdu: string;
  english: string;
  contextRoman: string;
  contextEn: string;
  reference: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  habitsCompleted: string[]; // habit IDs
  prayers: Record<string, PrayerStatus>; // prayer ID -> status
  nawafilCompleted: string[]; // nafl IDs
  waterGlasses: number; // 250ml per glass
  notes?: string;
  duaCompleted?: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artistOrType: string;
  bpm: number;
  genre: 'Epic Mashup' | 'Halal Nasheed Beat' | 'Cardio Duff' | 'Ambient Power' | 'Heavy Lift' | 'Custom Audio' | string;
  durationSeconds: number;

  energyLevel: 'High' | 'Medium' | 'Calm Focus' | 'Explosive';
  description: string;
  youtubeId?: string;
  youtubeUrl?: string;
}

export type TimerMode = 'rest' | 'hiit' | 'stopwatch';

export interface HiitSettings {
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  currentRound: number;
  currentPhase: 'prepare' | 'work' | 'rest' | 'done';
}

export interface PrayerAlarmConfig {
  prayerId: string;
  nameRoman: string;
  nameUrdu: string;
  nameEn: string;
  arabicName: string;
  alarmTime: string; // HH:mm in 24-hour format
  enabled: boolean;
  category: 'fard' | 'nafl';
}

export interface AppState {
  language: Language;
  dailyLogs: Record<string, DailyLog>; // key: YYYY-MM-DD
  customHabits: HabitItem[];
  workouts: WorkoutRecord[];
  cleanDaysStreak: number;
  lastSlipDate: string | null;
  tasbeehCounts: Record<string, number>;
  selectedDate: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  prayerAlarms?: PrayerAlarmConfig[];
}
