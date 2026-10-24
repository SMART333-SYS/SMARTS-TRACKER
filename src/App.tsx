import React, { useState, useEffect } from 'react';
import { AppState, DailyLog, HabitItem, Language, MusicTrack, PrayerStatus, TabType, WorkoutRecord } from './types/index.ts';
import { loadAppState, saveAppState, getInitialDailyLog, getDefaultAppState } from './utils/storage.ts';
import { getTodayKey } from './utils/date.ts';
import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { RoutineSection } from './components/RoutineSection.tsx';
import { NamazSection } from './components/NamazSection.tsx';
import { EmergencySection } from './components/EmergencySection.tsx';
import { GymSection } from './components/GymSection.tsx';
import { ExerciseTimer } from './components/ExerciseTimer.tsx';
import { DuaSection } from './components/DuaSection.tsx';
import { QuranSection } from './components/QuranSection.tsx';
import { YouTubeHub } from './components/YouTubeHub.tsx';
import { YouTubeMiniPlayer } from './components/YouTubeMiniPlayer.tsx';
import { TasbeehSection } from './components/TasbeehSection.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { InstallAppBanner } from './components/InstallAppBanner.tsx';
import { InstallAndOfflineSection } from './components/InstallAndOfflineSection.tsx';
import { triggerHaptic } from './utils/audio.ts';
import { POPULAR_SONG_CATALOG, SongCatalogItem } from './data/songCatalog.ts';

const DEFAULT_ATTACHED_TRACK: MusicTrack = {
  id: 'emraan_vol_1',
  title: 'Emraan Hashmi Hits - Superhit Mashup Vol 1',
  artistOrType: 'Emraan Hashmi & Pritam',
  bpm: 126,
  genre: 'Epic Mashup',
  durationSeconds: 1477,
  energyLevel: 'High',
  description: 'High energy mashup for workout sessions.',
  youtubeId: 'UbuhuRVoieA',
};

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<TabType>('routine');
  const [attachedMusic, setAttachedMusic] = useState<MusicTrack | null>(DEFAULT_ATTACHED_TRACK);

  // YouTube Floating Mini-Player (Choti Screen) State - Persistent across tab navigation
  const [isMiniPlayerOpen, setIsMiniPlayerOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mr_smart_fitness_miniplayer_open');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [miniPlayerVideoId, setMiniPlayerVideoId] = useState<string>(() => {
    try {
      return localStorage.getItem('mr_smart_fitness_miniplayer_vid') || 'UbuhuRVoieA';
    } catch {
      return 'UbuhuRVoieA';
    }
  });
  const [miniPlayerTitle, setMiniPlayerTitle] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('mr_smart_fitness_miniplayer_title') ||
        'Emraan Hashmi Hits - Superhit Mashup Vol 1'
      );
    } catch {
      return 'Emraan Hashmi Hits - Superhit Mashup Vol 1';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mr_smart_fitness_miniplayer_open', JSON.stringify(isMiniPlayerOpen));
      localStorage.setItem('mr_smart_fitness_miniplayer_vid', miniPlayerVideoId);
      localStorage.setItem('mr_smart_fitness_miniplayer_title', miniPlayerTitle);
    } catch {}
  }, [isMiniPlayerOpen, miniPlayerVideoId, miniPlayerTitle]);

  // Sync state to LocalStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Automatic midnight date rollover check for Pakistan Standard Time (Asia/Karachi UTC+5)
  useEffect(() => {
    const checkMidnight = () => {
      const todayKey = getTodayKey();
      setState((prev) => {
        // If current selectedDate was yesterday, automatically advance to today
        if (prev.selectedDate && prev.selectedDate !== todayKey) {
          const logs = { ...prev.dailyLogs };
          if (!logs[todayKey]) {
            logs[todayKey] = getInitialDailyLog(todayKey);
          }
          return {
            ...prev,
            selectedDate: todayKey,
            dailyLogs: logs,
          };
        }
        return prev;
      });
    };

    const timer = setInterval(checkMidnight, 30000); // Check every 30s
    return () => clearInterval(timer);
  }, []);

  // Ensure current selected date's log exists
  const selectedDate = state.selectedDate || getTodayKey();
  const currentLog: DailyLog = state.dailyLogs[selectedDate] || getInitialDailyLog(selectedDate);

  // Updates current daily log safely
  const updateCurrentLog = (updater: (prev: DailyLog) => DailyLog) => {
    setState((prevState) => {
      const existing = prevState.dailyLogs[selectedDate] || getInitialDailyLog(selectedDate);
      const updated = updater(existing);
      return {
        ...prevState,
        dailyLogs: {
          ...prevState.dailyLogs,
          [selectedDate]: updated,
        },
      };
    });
  };

  // 1. Language Toggle
  const handleLanguageChange = (lang: Language) => {
    triggerHaptic(15, state.hapticEnabled);
    setState((prev) => ({ ...prev, language: lang }));
  };

  // 2. Date Selection
  const handleDateChange = (dateKey: string) => {
    setState((prev) => {
      const logs = { ...prev.dailyLogs };
      if (!logs[dateKey]) {
        logs[dateKey] = getInitialDailyLog(dateKey);
      }
      return { ...prev, selectedDate: dateKey, dailyLogs: logs };
    });
  };

  // 3. Sound Toggle
  const handleToggleSound = () => {
    triggerHaptic(20, state.hapticEnabled);
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // 4. Habit Toggle
  const handleToggleHabit = (habitId: string) => {
    updateCurrentLog((log) => {
      const exists = log.habitsCompleted.includes(habitId);
      const newHabits = exists
        ? log.habitsCompleted.filter((id) => id !== habitId)
        : [...log.habitsCompleted, habitId];
      return { ...log, habitsCompleted: newHabits };
    });
  };

  // 5. Add Custom Habit
  const handleAddCustomHabit = (
    title: string,
    category: 'spiritual' | 'work' | 'health' | 'mindset'
  ) => {
    const newHabit: HabitItem = {
      id: `custom_${Date.now()}`,
      titleRoman: title,
      titleUrdu: title,
      titleEn: title,
      category,
      isCustom: true,
    };
    setState((prev) => ({
      ...prev,
      customHabits: [...prev.customHabits, newHabit],
    }));
  };

  // 6. Delete Custom Habit
  const handleDeleteCustomHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      customHabits: prev.customHabits.filter((h) => h.id !== habitId),
    }));
  };

  // 7. Prayer Status Update
  const handleUpdatePrayerStatus = (prayerId: string, status: PrayerStatus) => {
    updateCurrentLog((log) => ({
      ...log,
      prayers: {
        ...log.prayers,
        [prayerId]: status,
      },
    }));
  };

  // 8. Nafl Prayer Toggle
  const handleToggleNafl = (naflId: string) => {
    updateCurrentLog((log) => {
      const exists = log.nawafilCompleted.includes(naflId);
      const updated = exists
        ? log.nawafilCompleted.filter((id) => id !== naflId)
        : [...log.nawafilCompleted, naflId];
      return { ...log, nawafilCompleted: updated };
    });
  };

  // 9. Add Workout
  const handleAddWorkout = (workoutData: Omit<WorkoutRecord, 'id' | 'timestamp'>) => {
    const newRecord: WorkoutRecord = {
      ...workoutData,
      id: `workout_${Date.now()}`,
      timestamp: Date.now(),
      songTrack: workoutData.songTrack || (attachedMusic ? `${attachedMusic.title} (${attachedMusic.bpm} BPM)` : undefined),
    };
    setState((prev) => ({
      ...prev,
      workouts: [newRecord, ...prev.workouts],
    }));
  };

  // 10. Delete Workout
  const handleDeleteWorkout = (id: string) => {
    setState((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((w) => w.id !== id),
    }));
  };

  // 11. Water Glasses update
  const handleUpdateWater = (count: number) => {
    updateCurrentLog((log) => ({
      ...log,
      waterGlasses: count,
    }));
  };

  // 12. Clean streak actions
  const handleIncrementCleanStreak = () => {
    setState((prev) => ({
      ...prev,
      cleanDaysStreak: prev.cleanDaysStreak + 1,
    }));
  };

  const handleResetSlip = () => {
    setState((prev) => ({
      ...prev,
      cleanDaysStreak: 0,
      lastSlipDate: getTodayKey(),
    }));
  };

  // 13. Tasbeeh Counts
  const handleUpdateTasbeehCount = (dhikrId: string, count: number) => {
    setState((prev) => ({
      ...prev,
      tasbeehCounts: {
        ...prev.tasbeehCounts,
        [dhikrId]: count,
      },
    }));
  };

  // Mini-Player Actions
  const handleOpenMiniPlayer = (id: string, title: string) => {
    triggerHaptic(25);
    setMiniPlayerVideoId(id);
    setMiniPlayerTitle(title);
    setIsMiniPlayerOpen(true);
  };

  const handleToggleMiniPlayer = () => {
    triggerHaptic(20);
    setIsMiniPlayerOpen((prev) => !prev);
  };

  return (
    <div
      dir={state.language === 'urdu' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 text-slate-900 pb-24 md:pb-12 relative ${
        state.language === 'urdu' ? 'font-urdu' : ''
      }`}
    >
      {/* Stylish Ambient Colorful Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-64 -right-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl" />
      </div>

      {/* 0. Real-time Offline Connectivity Status (Play Store Offline App Experience) */}
      <OfflineIndicator language={state.language} />

      {/* 1. Header (Three-zone Top Bar Contract with Choti Screen toggle) */}
      <Header
        language={state.language}
        onLanguageChange={handleLanguageChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        cleanStreak={state.cleanDaysStreak}
        soundEnabled={state.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenEmergency={() => setActiveTab('safety')}
        onOpenTasbeeh={() => setActiveTab('tasbeeh')}
        onToggleMiniPlayer={handleToggleMiniPlayer}
        isMiniPlayerOpen={isMiniPlayerOpen}
        onOpenInstall={() => setActiveTab('install')}
      />

      {/* PWA Install Banner */}
      <InstallAppBanner language={state.language} onOpenInstallSection={() => setActiveTab('install')} />

      {/* 2. Navigation (Segmented on desktop, bottom bar on mobile) */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={state.language}
      />

      {/* 3. Main Body Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'routine' && (
          <RoutineSection
            currentLog={currentLog}
            onToggleHabit={handleToggleHabit}
            customHabits={state.customHabits}
            onAddCustomHabit={handleAddCustomHabit}
            onDeleteCustomHabit={handleDeleteCustomHabit}
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
          />
        )}

        {activeTab === 'namaz' && (
          <NamazSection
            currentLog={currentLog}
            onUpdatePrayerStatus={handleUpdatePrayerStatus}
            onToggleNafl={handleToggleNafl}
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
          />
        )}

        {activeTab === 'safety' && (
          <EmergencySection
            cleanStreak={state.cleanDaysStreak}
            onIncrementCleanStreak={handleIncrementCleanStreak}
            onResetSlip={handleResetSlip}
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
          />
        )}

        {activeTab === 'gym' && (
          <GymSection
            workouts={state.workouts}
            onAddWorkout={handleAddWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            waterGlasses={currentLog.waterGlasses}
            onUpdateWater={handleUpdateWater}
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
          />
        )}

        {activeTab === 'timer' && (
          <ExerciseTimer
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
          />
        )}

        {activeTab === 'quran' && (
          <QuranSection
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
            onOpenInstallSection={() => setActiveTab('install')}
          />
        )}

        {activeTab === 'dua' && (
          <DuaSection
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
            selectedDate={selectedDate}
            isDuaCompletedToday={!!currentLog.duaCompleted}
            onToggleDuaCompleted={() => {
              updateCurrentLog((log) => ({
                ...log,
                duaCompleted: !log.duaCompleted,
              }));
            }}
          />
        )}

        {(activeTab === 'youtube' || activeTab === 'music' || activeTab === 'audioplayer') && (
          <YouTubeHub
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
            currentVideoId={miniPlayerVideoId}
            currentTitle={miniPlayerTitle}
            onPlayVideo={(vId, vTitle) => {
              setMiniPlayerVideoId(vId);
              setMiniPlayerTitle(vTitle);
            }}
            onToggleMiniPlayer={handleToggleMiniPlayer}
            isMiniPlayerOpen={isMiniPlayerOpen}
            attachedSongTitle={attachedMusic?.title}
            onAttachSongToWorkout={(song: SongCatalogItem) => {
              setAttachedMusic({
                id: song.id,
                title: song.title,
                artistOrType: song.artist,
                genre: song.category,
                bpm: song.bpm,
                durationSeconds: 300,
                energyLevel: 'High',
                description: song.audioNotes || song.title,
                youtubeId: song.youtubeId,
                youtubeUrl: song.youtubeUrl,
              });
            }}
          />
        )}

        {activeTab === 'tasbeeh' && (
          <TasbeehSection
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
            counts={state.tasbeehCounts}
            onUpdateCount={handleUpdateTasbeehCount}
          />
        )}

        {activeTab === 'install' && (
          <InstallAndOfflineSection
            language={state.language}
            soundEnabled={state.soundEnabled}
            hapticEnabled={state.hapticEnabled}
          />
        )}
      </main>

      {/* 4. Floating Small Screen YouTube Mini-Player (Choti Screen) */}
      <YouTubeMiniPlayer
        videoId={miniPlayerVideoId}
        videoTitle={miniPlayerTitle}
        isOpen={isMiniPlayerOpen}
        onClose={() => setIsMiniPlayerOpen(false)}
        onSwitchVideo={(id, title) => {
          setMiniPlayerVideoId(id);
          setMiniPlayerTitle(title);
        }}
        language={state.language}
      />

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span>🌱 SMARTS TRACKER</span>
          <span>·</span>
          <span>Deen & Dunya Discipline</span>
        </div>
        <p className="text-[11px] text-slate-400">
          "Al-Mu'min al-Qawi khayrun wa ahabbu ilallahi min al-mu'min ad-da'if"
        </p>
      </footer>
    </div>
  );
}
