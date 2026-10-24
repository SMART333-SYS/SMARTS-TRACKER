import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, Plus, Flame, Timer, Activity, Volume2, Bell } from 'lucide-react';
import { Language, TimerMode } from '../types/index.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';
import confetti from 'canvas-confetti';

interface ExerciseTimerProps {
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  onClose?: () => void;
}

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  const [mode, setMode] = useState<TimerMode>('rest');

  // --- 1. Rest Timer State ---
  const [restDuration, setRestDuration] = useState<number>(60);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(60);
  const [isRestRunning, setIsRestRunning] = useState<boolean>(false);

  // --- 2. HIIT / Tabata State ---
  const [workSeconds, setWorkSeconds] = useState<number>(40);
  const [hiitRestSeconds, setHiitRestSeconds] = useState<number>(20);
  const [totalRounds, setTotalRounds] = useState<number>(8);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [hiitPhase, setHiitPhase] = useState<'work' | 'rest' | 'complete'>('work');
  const [hiitSecondsLeft, setHiitSecondsLeft] = useState<number>(40);
  const [isHiitRunning, setIsHiitRunning] = useState<boolean>(false);

  // --- 3. Stopwatch State ---
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Rest Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRestRunning && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            soundManager.playTimerBeep(false, soundEnabled);
            triggerHaptic(15, hapticEnabled);
          } else if (prev === 1) {
            soundManager.playTimerBeep(true, soundEnabled);
            triggerHaptic(60, hapticEnabled);
            setIsRestRunning(false);
            confetti({
              particleCount: 50,
              spread: 60,
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
  }, [isRestRunning, restSecondsLeft, soundEnabled, hapticEnabled]);

  // HIIT Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isHiitRunning && hiitPhase !== 'complete') {
      interval = setInterval(() => {
        setHiitSecondsLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            soundManager.playTimerBeep(false, soundEnabled);
            triggerHaptic(15, hapticEnabled);
          }
          if (prev <= 1) {
            soundManager.playTimerBeep(true, soundEnabled);
            triggerHaptic(40, hapticEnabled);

            // Transition logic
            if (hiitPhase === 'work') {
              // Switch to rest
              setHiitPhase('rest');
              return hiitRestSeconds;
            } else {
              // Rest finished, move to next round or complete
              if (currentRound >= totalRounds) {
                setHiitPhase('complete');
                setIsHiitRunning(false);
                soundManager.playSuccess(soundEnabled);
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 }
                });
                return 0;
              } else {
                setCurrentRound((r) => r + 1);
                setHiitPhase('work');
                return workSeconds;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHiitRunning, hiitPhase, currentRound, totalRounds, workSeconds, hiitRestSeconds, soundEnabled, hapticEnabled]);

  // Stopwatch Interval
  const swStartTimeRef = useRef<number>(0);
  useEffect(() => {
    let animFrame: number;
    if (isStopwatchRunning) {
      swStartTimeRef.current = performance.now() - stopwatchMs;
      const update = () => {
        setStopwatchMs(performance.now() - swStartTimeRef.current);
        animFrame = requestAnimationFrame(update);
      };
      animFrame = requestAnimationFrame(update);
    }
    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [isStopwatchRunning]);

  // Helper actions
  const selectRestPreset = (seconds: number) => {
    triggerHaptic(20, hapticEnabled);
    soundManager.playTap(soundEnabled);
    setRestDuration(seconds);
    setRestSecondsLeft(seconds);
    setIsRestRunning(false);
  };

  const addRestTime = (seconds: number) => {
    triggerHaptic(15, hapticEnabled);
    soundManager.playTap(soundEnabled);
    setRestSecondsLeft((prev) => prev + seconds);
    setRestDuration((prev) => Math.max(prev, restSecondsLeft + seconds));
  };

  const resetRestTimer = () => {
    triggerHaptic(20, hapticEnabled);
    setIsRestRunning(false);
    setRestSecondsLeft(restDuration);
  };

  const resetHiit = () => {
    triggerHaptic(20, hapticEnabled);
    setIsHiitRunning(false);
    setCurrentRound(1);
    setHiitPhase('work');
    setHiitSecondsLeft(workSeconds);
  };

  const resetStopwatch = () => {
    triggerHaptic(20, hapticEnabled);
    setIsStopwatchRunning(false);
    setStopwatchMs(0);
    setLaps([]);
  };

  const recordLap = () => {
    triggerHaptic(20, hapticEnabled);
    soundManager.playTap(soundEnabled);
    setLaps((prev) => [stopwatchMs, ...prev]);
  };

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${hundredths < 10 ? '0' : ''}${hundredths}`;
  };

  const restPercent = restDuration > 0 ? Math.round((restSecondsLeft / restDuration) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
      {/* Header and Mode Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Timer className="w-5 h-5 text-emerald-600" />
            <span>
              {language === 'urdu'
                ? 'ورزش و سیٹ ٹائمر'
                : language === 'roman-urdu'
                ? 'Exercise & Rest Timer'
                : 'Exercise & Rest Timer'}
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'urdu'
              ? 'سیٹس کے درمیان آرام اور ہائی انٹینسٹی ورزشوں کے لیے درست وقت'
              : 'Sets ke darmiyan rest aur HIIT rounds ke liye precision timing.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('rest')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              mode === 'rest'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'urdu' ? 'آرام (Rest)' : 'Rest Timer'}
          </button>
          <button
            onClick={() => setMode('hiit')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              mode === 'hiit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HIIT / Circuit
          </button>
          <button
            onClick={() => setMode('stopwatch')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              mode === 'stopwatch'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stopwatch
          </button>
        </div>
      </div>

      {/* --- MODE 1: REST TIMER --- */}
      {mode === 'rest' && (
        <div className="space-y-5">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[30, 60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => selectRestPreset(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tabular-nums ${
                  restDuration === sec && !isRestRunning
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sec < 60 ? `${sec}s` : `${sec / 60}m`}
              </button>
            ))}
          </div>

          {/* Central Circular Gauge */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-slate-100"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * restPercent) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="text-emerald-500 transition-all duration-300"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono tracking-tight text-slate-900 tabular-nums">
                  {formatMinSec(restSecondsLeft)}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                  {isRestRunning ? 'Resting...' : restSecondsLeft === 0 ? 'Next Set Ready!' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Quick Extension (+15s, +30s) */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => addRestTime(15)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> 15s
              </button>
              <button
                onClick={() => addRestTime(30)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> 30s
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={() => {
                triggerHaptic(25, hapticEnabled);
                soundManager.playTap(soundEnabled);
                setIsRestRunning((prev) => !prev);
              }}
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 min-h-[44px] ${
                isRestRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isRestRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRestRunning ? 'Pause Rest' : 'Start Rest'}</span>
            </button>
            <button
              onClick={resetRestTimer}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- MODE 2: HIIT / CIRCUIT TIMER --- */}
      {mode === 'hiit' && (
        <div className="space-y-5">
          {/* Round and Phase Badge */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Interval</span>
              <span className="text-sm font-bold text-slate-900">
                Work: {workSeconds}s · Rest: {hiitRestSeconds}s
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block uppercase font-medium">Round</span>
              <span className="text-sm font-bold text-emerald-800 tabular-nums">
                {currentRound} / {totalRounds}
              </span>
            </div>
          </div>

          {/* Big Phase Visual Display */}
          <div
            className={`p-8 rounded-2xl text-center border transition-all ${
              hiitPhase === 'work'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : hiitPhase === 'rest'
                ? 'bg-blue-50 border-blue-300 text-blue-950'
                : 'bg-slate-900 text-white'
            }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
                hiitPhase === 'work'
                  ? 'bg-emerald-600 text-white'
                  : hiitPhase === 'rest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-500 text-slate-900'
              }`}
            >
              {hiitPhase === 'work' ? '🔥 WORK HARD' : hiitPhase === 'rest' ? '💧 BREATHE & REST' : 'COMPLETED!'}
            </span>
            <div className="text-5xl font-black font-mono tracking-tight tabular-nums">
              {formatMinSec(hiitSecondsLeft)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                triggerHaptic(25, hapticEnabled);
                soundManager.playTap(soundEnabled);
                setIsHiitRunning((prev) => !prev);
              }}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-md transition-all min-h-[44px]"
            >
              {isHiitRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isHiitRunning ? 'Pause HIIT' : 'Start HIIT'}</span>
            </button>
            <button
              onClick={resetHiit}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
              title="Reset Circuit"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- MODE 3: STOPWATCH --- */}
      {mode === 'stopwatch' && (
        <div className="space-y-5">
          <div className="bg-slate-900 text-white p-8 rounded-2xl text-center shadow-inner">
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight tabular-nums text-emerald-400">
              {formatStopwatch(stopwatchMs)}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                triggerHaptic(25, hapticEnabled);
                soundManager.playTap(soundEnabled);
                setIsStopwatchRunning((prev) => !prev);
              }}
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 min-h-[44px] ${
                isStopwatchRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isStopwatchRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStopwatchRunning ? 'Stop' : 'Start'}</span>
            </button>

            {isStopwatchRunning && (
              <button
                onClick={recordLap}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold min-h-[44px]"
              >
                Lap
              </button>
            )}

            <button
              onClick={resetStopwatch}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="mt-3 max-h-36 overflow-y-auto space-y-1.5 border-t border-slate-100 pt-3">
              {laps.map((lap, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 font-mono"
                >
                  <span className="text-slate-400">Lap #{laps.length - idx}</span>
                  <span className="font-bold text-slate-900">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
