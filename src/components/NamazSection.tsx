import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Bell,
  BellOff,
  BellRing,
  Check,
  CheckCircle,
  Clock,
  Moon,
  Play,
  Sparkles,
  Sun,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import { DailyLog, Language, PrayerAlarmConfig, PrayerStatus } from '../types/index.ts';
import { NAWAFIL_LIST, PRAYERS_LIST } from '../data/duas.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';
import { DEFAULT_PRAYER_ALARMS, formatTime12h, getPakistanTimeInfo } from '../utils/pakistanTime.ts';
import confetti from 'canvas-confetti';

interface NamazSectionProps {
  currentLog: DailyLog;
  onUpdatePrayerStatus: (prayerId: string, status: PrayerStatus) => void;
  onToggleNafl: (naflId: string) => void;
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

const STORAGE_ALARMS_KEY = 'mr_smart_namaz_alarms_v1';

export const NamazSection: React.FC<NamazSectionProps> = ({
  currentLog,
  onUpdatePrayerStatus,
  onToggleNafl,
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  // Alarms configuration state persisted in localStorage
  const [alarms, setAlarms] = useState<PrayerAlarmConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ALARMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PRAYER_ALARMS;
  });

  // Current Pakistan time state
  const [pktInfo, setPktInfo] = useState(() => getPakistanTimeInfo());

  // Active triggered alarm modal/banner
  const [activeAlarm, setActiveAlarm] = useState<PrayerAlarmConfig | null>(null);
  const [lastTriggeredKey, setLastTriggeredKey] = useState<string>('');

  // Persist alarms
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ALARMS_KEY, JSON.stringify(alarms));
    } catch {}
  }, [alarms]);

  // Real-time Pakistan clock tick and Prayer Alarm check
  useEffect(() => {
    const timer = setInterval(() => {
      const info = getPakistanTimeInfo();
      setPktInfo(info);

      const currentPktTime = info.time24; // "HH:mm"
      const triggerKey = `${info.dateKey}_${currentPktTime}`;

      // Check if current time matches any enabled alarm
      if (triggerKey !== lastTriggeredKey) {
        const matchingAlarm = alarms.find(
          (a) => a.enabled && a.alarmTime === currentPktTime
        );

        if (matchingAlarm) {
          setLastTriggeredKey(triggerKey);
          setActiveAlarm(matchingAlarm);
          soundManager.playPrayerReminderSound(soundEnabled);
          triggerHaptic(50, hapticEnabled);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [alarms, lastTriggeredKey, soundEnabled, hapticEnabled]);

  // Count how many prayers are fulfilled
  const completedFardCount = PRAYERS_LIST.filter((p) => {
    const s = currentLog.prayers[p.id];
    return s === 'jamaat' || s === 'on_time' || s === 'qaza';
  }).length;

  const handleStatusChange = (prayerId: string, status: PrayerStatus) => {
    triggerHaptic(20, hapticEnabled);
    soundManager.playTap(soundEnabled);

    // If completing the 5th prayer today, trigger celebration
    const currentStatus = currentLog.prayers[prayerId];
    const isNowFulfill = status === 'jamaat' || status === 'on_time';
    const wasFulfill = currentStatus === 'jamaat' || currentStatus === 'on_time';

    if (isNowFulfill && !wasFulfill && completedFardCount + 1 === 5) {
      soundManager.playSuccess(soundEnabled);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
      });
    }

    onUpdatePrayerStatus(prayerId, status);
  };

  const handleToggleNaflItem = (naflId: string) => {
    triggerHaptic(15, hapticEnabled);
    soundManager.playTap(soundEnabled);
    onToggleNafl(naflId);
  };

  const handleToggleAlarm = (prayerId: string) => {
    triggerHaptic(20, hapticEnabled);
    setAlarms((prev) =>
      prev.map((a) => {
        if (a.prayerId === prayerId) {
          const nextState = !a.enabled;
          if (nextState) {
            soundManager.playPrayerBell(soundEnabled);
          }
          return { ...a, enabled: nextState };
        }
        return a;
      })
    );
  };

  const handleAlarmTimeChange = (prayerId: string, newTime: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.prayerId === prayerId ? { ...a, alarmTime: newTime } : a))
    );
  };

  const handleTestBell = (alarm: PrayerAlarmConfig) => {
    triggerHaptic(30, hapticEnabled);
    soundManager.playPrayerReminderSound(soundEnabled);
    setActiveAlarm(alarm);
  };

  const handleDismissActiveAlarm = () => {
    triggerHaptic(15, hapticEnabled);
    setActiveAlarm(null);
  };

  const handleSnoozeActiveAlarm = () => {
    triggerHaptic(20, hapticEnabled);
    if (!activeAlarm) return;
    // Snooze by advancing alarm by 5 minutes
    const [h, m] = activeAlarm.alarmTime.split(':').map((v) => parseInt(v, 10));
    const totalMinutes = (h * 60 + m + 5) % (24 * 60);
    const newH = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, '0');
    const newM = (totalMinutes % 60).toString().padStart(2, '0');
    const snoozedTime = `${newH}:${newM}`;

    handleAlarmTimeChange(activeAlarm.prayerId, snoozedTime);
    setActiveAlarm(null);
  };

  const getPrayerName = (id: string) => {
    const item = PRAYERS_LIST.find((p) => p.id === id);
    if (!item) return id;
    if (language === 'urdu') return item.nameUrdu;
    if (language === 'english') return item.nameEn;
    return item.nameRoman;
  };

  return (
    <div className="space-y-6">
      {/* Active Namaz Time Alarm Modal / Pop-over */}
      {activeAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-500 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

            <button
              onClick={handleDismissActiveAlarm}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Bell Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner ring-8 ring-emerald-50 animate-bounce">
              <BellRing className="w-8 h-8 text-emerald-600" />
            </div>

            {/* Badge: Reminder Bell ON */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-semibold text-xs mb-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping" />
              <span>🔔 Reminder Bell ON</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              {language === 'urdu'
                ? `${activeAlarm.nameUrdu} کا وقت ہو گیا ہے!`
                : `${activeAlarm.nameRoman} Ka Waqt Ho Gaya!`}
            </h3>

            <p className="font-arabic text-emerald-700 text-lg mt-1 font-semibold">
              {activeAlarm.arabicName} · {formatTime12h(activeAlarm.alarmTime)}
            </p>

            <p className="text-xs text-slate-600 mt-2">
              {language === 'urdu'
                ? 'نماز کی تیاری فرمائیں۔ وضو کریں اور اول وقت یا باجماعت نماز ادا کریں۔'
                : 'Wudu karein aur masjid ya awal waqt par namaz ada karein. Allah qabool farmaye.'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => {
                  handleStatusChange(activeAlarm.prayerId, 'jamaat');
                  handleDismissActiveAlarm();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'urdu' ? 'باجماعت ادا کی' : "Jama'at Done"}</span>
              </button>

              <button
                onClick={() => {
                  handleStatusChange(activeAlarm.prayerId, 'on_time');
                  handleDismissActiveAlarm();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'urdu' ? 'باوقت ادا کی' : 'On-Time Done'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={handleSnoozeActiveAlarm}
                className="py-1.5 px-3 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium"
              >
                ⏱️ {language === 'urdu' ? '5 منٹ بعد سنوز' : 'Snooze 5 Min'}
              </button>
              <button
                onClick={handleDismissActiveAlarm}
                className="py-1.5 px-3 rounded-lg text-slate-500 hover:bg-slate-100 font-medium"
              >
                {language === 'urdu' ? 'بند کریں' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Time Alarm & Reminder Bell Control Box (وقت کا الارم اور ریمائنڈر بیل) */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <BellRing className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>
                    {language === 'urdu'
                      ? 'نماز کے اوقات، الارم اور ریمائنڈر بیل'
                      : 'Namaz Alarms & Reminder Bell'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-950 font-sans">
                    PKT (پاکستان)
                  </span>
                </h3>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  {language === 'urdu'
                    ? 'نماز کا وقت ہونے پر آٹومیٹک ریمائنڈر بیل بجے گی اور اسکرین پر شو ہوگا'
                    : 'Waqt par reminder bell baje gi aur screen par alert aayega.'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Live Pakistan Clock Display */}
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40">
            <span className="text-lg">🇵🇰</span>
            <div className="text-right">
              <div className="text-[10px] text-emerald-300 font-semibold uppercase tracking-wider">
                {language === 'urdu' ? 'موجودہ پاکستان وقت' : 'Current PK Time'}
              </div>
              <div className="text-sm font-bold font-mono text-white tracking-tight tabular-nums">
                {pktInfo.time12}
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>

        {/* Alarms Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {alarms.map((alarm) => {
            return (
              <div
                key={alarm.prayerId}
                className={`p-3.5 rounded-xl border transition-all ${
                  alarm.enabled
                    ? 'bg-emerald-950/60 border-emerald-500/60 shadow-xs'
                    : 'bg-slate-800/60 border-slate-700/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">
                      {language === 'urdu'
                        ? alarm.nameUrdu
                        : language === 'english'
                        ? alarm.nameEn
                        : alarm.nameRoman}
                    </span>
                    <span className="text-xs text-emerald-300 font-arabic">
                      {alarm.arabicName}
                    </span>
                  </div>

                  {/* Test Sound Button */}
                  <button
                    onClick={() => handleTestBell(alarm)}
                    className="p-1 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors"
                    title="Test Bell Sound"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Alarm Time Input (HH:mm) */}
                <div className="flex items-center justify-between gap-2 mb-2 bg-slate-900/80 p-2 rounded-lg border border-emerald-500/30">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{formatTime12h(alarm.alarmTime)}</span>
                  </span>

                  <input
                    type="time"
                    value={alarm.alarmTime}
                    onChange={(e) => handleAlarmTimeChange(alarm.prayerId, e.target.value)}
                    className="bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded border border-slate-600 focus:outline-hidden focus:border-emerald-400 font-mono"
                    title="Change Alarm Time"
                  />
                </div>

                {/* Reminder Bell Status / Toggle Button */}
                <button
                  onClick={() => handleToggleAlarm(alarm.prayerId)}
                  className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    alarm.enabled
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs ring-2 ring-emerald-300/40'
                      : 'bg-slate-700/80 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {alarm.enabled ? (
                    <>
                      <BellRing className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                      <span>🔔 Reminder Bell ON</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>🔕 Bell OFF</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 5 Waqt Header Card & Fard Tracker */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>🕌</span>
              <span>
                {language === 'urdu'
                  ? 'پانچ وقت نماز ٹریکر'
                  : language === 'roman-urdu'
                  ? '5 Waqt Namaz Tracker'
                  : '5 Daily Prayers Tracker'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'urdu'
                ? 'نماز دین کا ستون ہے۔ جماعت اور اول وقت کی فضیلت حاصل کریں۔'
                : language === 'roman-urdu'
                ? "Namaz deen ka sutoon hai. Jama'at ya waqt par adaigi ka record rakhein."
                : 'Prayer is the pillar of faith. Prioritize congregation and on-time performance.'}
            </p>
          </div>

          {/* 5/5 Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200 shrink-0">
            <CheckCircle className={`w-5 h-5 ${completedFardCount === 5 ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div>
              <div className="text-[11px] text-emerald-800 font-medium">
                {language === 'urdu' ? 'فرائض کی تکمیل' : language === 'roman-urdu' ? 'Fardh Status' : 'Fardh Completed'}
              </div>
              <div className="text-base font-bold text-emerald-950 tabular-nums">
                {completedFardCount} / 5
              </div>
            </div>
          </div>
        </div>

        {/* 5 Prayers Grid */}
        <div className="mt-5 space-y-3">
          {PRAYERS_LIST.map((prayer) => {
            const currentStatus = currentLog.prayers[prayer.id] || 'pending';
            const isCompleted =
              currentStatus === 'jamaat' ||
              currentStatus === 'on_time' ||
              currentStatus === 'qaza';
            const alarmConfig = alarms.find((a) => a.prayerId === prayer.id);

            const getPrayerTheme = (id: string) => {
              switch (id) {
                case 'fajr':
                  return {
                    badgeBg: 'bg-gradient-to-tr from-sky-800 via-indigo-900 to-slate-900 text-sky-200 ring-2 ring-sky-500/30 shadow-md shadow-sky-950/20',
                    border: 'hover:border-sky-300',
                  };
                case 'dhuhr':
                  return {
                    badgeBg: 'bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-500 text-slate-950 ring-2 ring-amber-300/50 shadow-md shadow-amber-500/20',
                    border: 'hover:border-amber-300',
                  };
                case 'asr':
                  return {
                    badgeBg: 'bg-gradient-to-tr from-orange-500 via-amber-600 to-amber-700 text-white ring-2 ring-orange-400/40 shadow-md shadow-orange-500/20',
                    border: 'hover:border-orange-300',
                  };
                case 'maghrib':
                  return {
                    badgeBg: 'bg-gradient-to-tr from-rose-600 via-orange-600 to-amber-600 text-white ring-2 ring-rose-400/40 shadow-md shadow-rose-600/20',
                    border: 'hover:border-rose-300',
                  };
                case 'isha':
                default:
                  return {
                    badgeBg: 'bg-gradient-to-tr from-indigo-950 via-slate-900 to-teal-950 text-indigo-200 ring-2 ring-indigo-500/30 shadow-md shadow-indigo-950/30',
                    border: 'hover:border-indigo-300',
                  };
              }
            };

            const theme = getPrayerTheme(prayer.id);

            return (
              <div
                key={prayer.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-50/70 via-white to-slate-50 border-emerald-300/80 shadow-xs'
                    : `bg-white border-slate-200/90 shadow-xs ${theme.border}`
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Name & Arabic Info */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform ${theme.badgeBg}`}
                    >
                      {prayer.id === 'fajr' || prayer.id === 'maghrib' || prayer.id === 'isha' ? (
                        <Moon className="w-5 h-5" />
                      ) : (
                        <Sun className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-base sm:text-lg">
                          {getPrayerName(prayer.id)}
                        </span>
                        <span className="font-arabic font-bold text-emerald-800 text-base">
                          {prayer.arabicName}
                        </span>

                        {/* Reminder Bell Indicator in the list */}
                        {alarmConfig && (
                          <button
                            onClick={() => handleToggleAlarm(prayer.id)}
                            className={`inline-flex items-center gap-1 text-[10.5px] px-2.5 py-0.5 rounded-full font-bold transition-all active:scale-95 ${
                              alarmConfig.enabled
                                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-300 shadow-xs'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Toggle Prayer Alarm Bell"
                          >
                            {alarmConfig.enabled ? (
                              <>
                                <BellRing className="w-3 h-3 text-emerald-600 fill-emerald-600 animate-bounce" />
                                <span>🔔 {formatTime12h(alarmConfig.alarmTime)}</span>
                              </>
                            ) : (
                              <>
                                <BellOff className="w-3 h-3 text-slate-400" />
                                <span>🔕 Off</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">
                          {alarmConfig ? formatTime12h(alarmConfig.alarmTime) : prayer.defaultTime}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-slate-600">
                          {prayer.fardRakat} Fardh + {prayer.sunnahRakat} Sunnah
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Options with Vibrant Glowing Colors */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Jamaat Button */}
                    <button
                      onClick={() =>
                        handleStatusChange(prayer.id, currentStatus === 'jamaat' ? 'pending' : 'jamaat')
                      }
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        currentStatus === 'jamaat'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>{language === 'urdu' ? 'باجماعت' : "Jama'at"}</span>
                    </button>

                    {/* Ba-Waqt Button */}
                    <button
                      onClick={() =>
                        handleStatusChange(prayer.id, currentStatus === 'on_time' ? 'pending' : 'on_time')
                      }
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        currentStatus === 'on_time'
                          ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-800'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{language === 'urdu' ? 'باوقت' : 'Ba-Waqt'}</span>
                    </button>

                    {/* Qaza Button */}
                    <button
                      onClick={() =>
                        handleStatusChange(prayer.id, currentStatus === 'qaza' ? 'pending' : 'qaza')
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        currentStatus === 'qaza'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-800'
                      }`}
                    >
                      {language === 'urdu' ? 'قضاء' : 'Qaza'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Nawafil & Sunan Tracker */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>
            {language === 'urdu'
              ? 'نوافل، تہجد و سنتیں'
              : language === 'roman-urdu'
              ? 'Tahajjud & Nawafil Tracker'
              : 'Nawafil & Extra Prayers'}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {language === 'urdu'
            ? 'نوافل اللہ تعالی کے خاص قرب کا ذریعہ بنتے ہیں۔'
            : 'Nawafil Allah ka qurb aur dili sakoon hasil karne ka behtareen tareeqa hain.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {NAWAFIL_LIST.map((nafl) => {
            const isDone = currentLog.nawafilCompleted.includes(nafl.id);
            const alarmConfig = alarms.find((a) => a.prayerId === nafl.id);

            return (
              <button
                key={nafl.id}
                onClick={() => handleToggleNaflItem(nafl.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                  isDone
                    ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/80 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs hover:border-emerald-200'
                }`}
              >
                <div>
                  <div className="text-xs font-medium">
                    {language === 'urdu'
                      ? nafl.nameUrdu
                      : language === 'english'
                      ? nafl.nameEn
                      : nafl.nameRoman}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {alarmConfig && alarmConfig.enabled ? (
                      <span className="text-emerald-700 font-semibold">
                        🔔 {formatTime12h(alarmConfig.alarmTime)}
                      </span>
                    ) : nafl.id === 'tahajjud' ? (
                      'Last third of night'
                    ) : nafl.id === 'witr' ? (
                      'Wajib prayer'
                    ) : (
                      'Sunnah / Nafl'
                    )}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs transition-transform ${
                    isDone
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'border-2 border-slate-300'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Islamic Hadith Reflection */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs">
        <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
          Hadith Shareef
        </div>
        <p className="font-arabic text-lg text-emerald-100 mt-2 leading-relaxed">
          ”أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلَاتُهُ“
        </p>
        <p className="text-xs text-slate-300 mt-2">
          {language === 'urdu'
            ? 'قیامت کے دن بندے کے اعمال میں سب سے پہلے نماز کا حساب لیا جائے گا۔ (سنن الترمذی)'
            : language === 'roman-urdu'
            ? 'Qayamat ke din sab se pehla hisaab Namaz ka hoga. Agar namaz theek nikli toh banda kamyab ho gaya. (Sunan at-Tirmidhi)'
            : 'The first deed for which a person will be held accountable on the Day of Judgment is prayer. (Tirmidhi)'}
        </p>
      </div>
    </div>
  );
};
