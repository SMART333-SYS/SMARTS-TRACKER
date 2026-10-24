import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  HardDrive,
  WifiOff,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Play,
  Pause,
  Trash2,
  Loader2,
  Mic,
  Search,
  ShieldCheck,
  Globe,
  Radio,
  FileText,
} from 'lucide-react';
import { Language, QuranReciter, QuranSurahMeta } from '../types/index.ts';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { ALL_114_SURAHS, FAMOUS_QURA } from '../data/quranData.ts';
import {
  downloadSurahAudio,
  getPlayableAudio,
} from '../utils/quranService.ts';
import {
  deleteOfflineAudio,
  formatBytes,
  getAllDownloadedAudios,
  isSurahAudioDownloaded,
} from '../utils/quranOfflineStorage.ts';
import { triggerHaptic } from '../utils/audio.ts';

interface InstallAndOfflineSectionProps {
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

const POPULAR_PACK_SURAHS = [
  { num: 1, name: 'Al-Fatihah', urdu: 'الفاتحة' },
  { num: 36, name: 'Ya-Sin (Heart of Quran)', urdu: 'یس (دلِ قرآن)' },
  { num: 55, name: 'Ar-Rahman (Beauty)', urdu: 'الرحمن (زینت)' },
  { num: 67, name: 'Al-Mulk (Protection)', urdu: 'الملک (نجات)' },
  { num: 18, name: 'Al-Kahf (Friday Light)', urdu: 'الکہف (نورِ جمعہ)' },
  { num: 56, name: 'Al-Waqi\'ah (Barakah)', urdu: 'الواقعة (رزق و برکت)' },
  { num: 112, name: 'Al-Ikhlas (Tawheed)', urdu: 'الاخلاص' },
  { num: 113, name: 'Al-Falaq (Protection)', urdu: 'الفلق' },
  { num: 114, name: 'An-Nas (Protection)', urdu: 'الناس' },
];

export const InstallAndOfflineSection: React.FC<InstallAndOfflineSectionProps> = ({
  language,
  soundEnabled,
  hapticEnabled,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();

  // Selected Reciter for downloads
  const [selectedReciterId, setSelectedReciterId] = useState<string>(() => {
    try {
      return localStorage.getItem('mr_smart_selected_qari') || 'alafasy';
    } catch {
      return 'alafasy';
    }
  });

  const selectedReciter: QuranReciter =
    FAMOUS_QURA.find((q) => q.id === selectedReciterId) || FAMOUS_QURA[0];

  // Downloads tracking
  const [downloadedAudios, setDownloadedAudios] = useState<
    Array<{ key: string; surahNumber: number; reciterId: string; size: number }>
  >([]);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchCurrentSurah, setBatchCurrentSurah] = useState<string>('');

  // Audio preview state
  const [activePlayingSurah, setActivePlayingSurah] = useState<number | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  // Search in downloads
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'downloaded'>('all');

  // Copy app link
  const [copiedLink, setCopiedLink] = useState(false);

  // Refresh downloaded audio records from IndexedDB
  const refreshDownloads = async () => {
    try {
      const records = await getAllDownloadedAudios();
      setDownloadedAudios(records);
    } catch (e) {
      console.warn('Failed to load downloaded audios:', e);
    }
  };

  useEffect(() => {
    refreshDownloads();
  }, []);

  const totalBytesDownloaded = downloadedAudios.reduce((acc, curr) => acc + curr.size, 0);

  // Single Surah Download
  const handleDownloadSingle = async (surahNum: number) => {
    if (hapticEnabled) triggerHaptic(20);
    const key = `${surahNum}_${selectedReciter.id}`;
    if (downloadProgress[key] !== undefined) return;

    setDownloadProgress((prev) => ({ ...prev, [key]: 5 }));
    try {
      const res = await downloadSurahAudio(surahNum, selectedReciter, (pct) => {
        setDownloadProgress((prev) => ({ ...prev, [key]: pct }));
      });
      if (res.success) {
        await refreshDownloads();
      }
    } finally {
      setTimeout(() => {
        setDownloadProgress((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }, 1000);
    }
  };

  // Delete Downloaded Surah
  const handleDeleteDownload = async (surahNum: number) => {
    if (hapticEnabled) triggerHaptic(20);
    await deleteOfflineAudio(surahNum, selectedReciter.id);
    if (activePlayingSurah === surahNum && audioInstance) {
      audioInstance.pause();
      setActivePlayingSurah(null);
    }
    await refreshDownloads();
  };

  // Batch download popular package
  const handleDownloadPopularPack = async () => {
    if (hapticEnabled) triggerHaptic(30);
    setIsBatchDownloading(true);

    for (const item of POPULAR_PACK_SURAHS) {
      const isAlready = downloadedAudios.some(
        (a) => a.surahNumber === item.num && a.reciterId === selectedReciter.id
      );
      if (isAlready) continue;

      setBatchCurrentSurah(item.name);
      const key = `${item.num}_${selectedReciter.id}`;
      setDownloadProgress((prev) => ({ ...prev, [key]: 10 }));

      try {
        await downloadSurahAudio(item.num, selectedReciter, (pct) => {
          setDownloadProgress((prev) => ({ ...prev, [key]: pct }));
        });
        await refreshDownloads();
      } catch (err) {
        console.error('Batch download item error:', err);
      } finally {
        setDownloadProgress((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    }

    setIsBatchDownloading(false);
    setBatchCurrentSurah('');
    await refreshDownloads();
  };

  // Play audio preview directly from offline storage
  const handleTogglePlay = async (surahNum: number) => {
    if (hapticEnabled) triggerHaptic(15);

    if (activePlayingSurah === surahNum && audioInstance) {
      audioInstance.pause();
      setActivePlayingSurah(null);
      return;
    }

    if (audioInstance) {
      audioInstance.pause();
    }

    try {
      const { url } = await getPlayableAudio(surahNum, selectedReciter);
      const audio = new Audio(url);
      setAudioInstance(audio);
      setActivePlayingSurah(surahNum);

      audio.onended = () => {
        setActivePlayingSurah(null);
      };

      await audio.play();
    } catch (e) {
      console.warn('Playback error:', e);
      setActivePlayingSurah(null);
    }
  };

  // Handle direct App Install trigger
  const handleInstallClick = async () => {
    if (hapticEnabled) triggerHaptic(30);
    if (isInstallable) {
      await install();
    }
  };

  // Handle copy standalone URL
  const handleCopyLink = () => {
    if (hapticEnabled) triggerHaptic(15);
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  // Filtered surah list
  const filteredSurahs = ALL_114_SURAHS.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.urduName.includes(q) ||
      s.nameArabic.includes(q) ||
      s.number.toString() === q;

    if (!matchSearch) return false;

    if (activeTabFilter === 'downloaded') {
      return downloadedAudios.some(
        (a) => a.surahNumber === s.number && a.reciterId === selectedReciter.id
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800 border border-white/20">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-black/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-2 shadow-sm border border-white/30">
              <Download className="w-3.5 h-3.5" />
              <span>
                {language === 'urdu'
                  ? 'ایپ انسٹالیشن و آف لائن ڈاؤنلوڈ پورٹل'
                  : 'App Install & Offline Download Portal'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
              <Smartphone className="w-6 h-6 text-cyan-200 shrink-0" />
              <span>
                {language === 'urdu'
                  ? 'موبائل ایپ انسٹال کریں اور بغیر نیٹ چلائیں'
                  : 'Install Mobile App & Run 100% Offline'}
              </span>
            </h1>
            <p className="text-xs text-emerald-100 mt-1.5 max-w-lg leading-relaxed font-medium">
              {language === 'urdu'
                ? 'پلے اسٹور کی طرح موبائل ہوم اسکرین پر محفوظ کریں، قرآن مجید کی تمام سورتیں ایک بار ڈاؤنلوڈ کریں اور انٹرنیٹ کے بغیر تلاوت سنیں۔'
                : 'Install on Android / iPhone home screen like a native app. Download Quran recitations once and play offline anytime without data or Wi-Fi.'}
            </p>
          </div>

          {/* Quick Storage Badge */}
          <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-white">
              <HardDrive className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-200">
                {language === 'urdu' ? 'آف لائن ڈیٹا' : 'Offline Stored'}
              </div>
              <div className="text-sm font-black text-white font-mono">
                {formatBytes(totalBytesDownloaded)}
              </div>
              <div className="text-[10px] text-emerald-200/80">
                {downloadedAudios.length} {language === 'urdu' ? 'سورتیں محفوظ' : 'Surahs ready'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary App Installation Action Card */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md shadow-slate-100/60 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-black text-slate-900">
                {language === 'urdu' ? 'ایپ ہوم اسکرین پر انسٹال کریں' : 'Install App to Home Screen'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {isInstalled
                ? language === 'urdu'
                  ? '✓ ایپ پہلے ہی آپ کے فون میں انسٹال ہے اور ہوم اسکرین پر موجود ہے۔'
                  : '✓ App is already running as installed application on your device.'
                : language === 'urdu'
                ? 'فون میں انسٹال ہونے کے بعد ایپ فل اسکرین بغیر براؤزر بار کے کھلتی ہے۔'
                : 'Works like a native Play Store app with home screen icon and fullscreen mode.'}
            </p>
          </div>

          {/* Install status pill */}
          <div className="flex items-center gap-2">
            {isInstalled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'urdu' ? 'انسٹال شدہ ✓' : 'Installed ✓'}</span>
              </span>
            ) : isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'urdu' ? 'ابھی ڈائریکٹ انسٹال کریں' : 'Install App Now'}</span>
              </button>
            ) : (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'urdu' ? 'انسٹال کرنے کا طریقہ' : 'Install Guide'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Step Pictorial Installation Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Step 1: Android */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Android (Chrome)
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-800">
              {language === 'urdu' ? 'اینڈرائڈ پر انسٹال' : 'Install on Android'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {language === 'urdu'
                ? 'کروم براؤزر کے اوپر تین نقطوں (⋮) پر ٹیپ کریں اور "Install app" یا "Add to Home screen" منتخب کریں۔'
                : 'Tap 3 dots (⋮) in Chrome menu and tap "Install app" or "Add to Home screen".'}
            </p>
          </div>

          {/* Step 2: iOS / Safari */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                iPhone / iPad (Safari)
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-800">
              {language === 'urdu' ? 'آئی فون پر انسٹال' : 'Install on iOS Safari'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium flex items-center gap-1">
              {language === 'urdu'
                ? 'سفاری کے نیچے شیئر آئیکن پر کلک کر کے "Add to Home Screen" منتخب کریں۔'
                : 'Tap Safari Share icon, scroll down and tap "Add to Home Screen".'}
            </p>
          </div>

          {/* Step 3: PC / Desktop */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Computer / Laptop
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-800">
              {language === 'urdu' ? 'کمپیوٹر میں انسٹال' : 'Install on PC / Edge'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {language === 'urdu'
                ? 'ایڈریس بار میں دائیں جانب موجود انسٹال آئیکن (⊕) پر کلک کر کے ونڈو ایپ بنائیں!'
                : 'Click the install icon (⊕) in address bar to install as a desktop window app.'}
            </p>
          </div>
        </div>

        {/* Copy App Link Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'urdu'
                ? 'براہِ راست موبائل کے کروم یا سفاری میں کھولنے کے لیے لنک کاپی کریں:'
                : 'Copy app link to open directly in mobile Chrome or Safari:'}
            </span>
          </div>
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'لنک کاپی ہو گیا!' : 'کاپی لنک (Copy Link)'}</span>
          </button>
        </div>
      </section>

      {/* 3. Offline Quran Download Manager */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-md shadow-slate-100/60 space-y-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'urdu' ? 'بغیر انٹرنیٹ تلاوت سنیں' : 'Zero Internet Playback'}</span>
          </div>
          <h2 className="text-base font-black text-slate-900">
            {language === 'urdu'
              ? 'قرآن مجید آف لائن ڈاؤن لوڈ مینیجر'
              : 'Quran Offline Audio Download Manager'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {language === 'urdu'
              ? 'سورتیں ایک بار ڈاؤن لوڈ کریں، پھر سفر میں یا بغیر نیٹ کے کہیں بھی پرسکون انداز میں سنیں۔'
              : 'Download Surahs once into device memory. Listen seamlessly while traveling or with zero internet.'}
          </p>
        </div>

        {/* 1-Click Popular Surahs Package Download Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg border border-emerald-500/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500/30 text-emerald-300">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {language === 'urdu'
                    ? 'اہم سورتیں مکمل پیکج (1-کلک تمام ڈاؤن لوڈ)'
                    : 'Download Complete Popular Surahs Pack (1-Click)'}
                </h3>
              </div>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-lg leading-relaxed">
                {language === 'urdu'
                  ? 'سورہ یٰسین، الرحمن، الملک، الکہف، الواقعہ اور ۴ قل شریف کو ایک ساتھ مکمل آف لائن محفوظ کریں۔'
                  : 'Includes Surah Ya-Sin, Ar-Rahman, Al-Mulk, Al-Kahf, Al-Waqi\'ah, and 4 Quls for offline listening.'}
              </p>

              {isBatchDownloading && (
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200 font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>ڈاؤن لوڈ جاری ہے: {batchCurrentSurah}...</span>
                </div>
              )}
            </div>

            <button
              onClick={handleDownloadPopularPack}
              disabled={isBatchDownloading}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isBatchDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>ڈاؤنلوڈنگ جاری ہے...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{language === 'urdu' ? 'تمام ۹ اہم سورتیں ڈاؤنلوڈ کریں' : 'Download All 9 Surahs'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Famous Reciter Selector for Offline Downloads */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Mic className="w-4 h-4 text-emerald-600" />
            <span>{language === 'urdu' ? 'قاری کی آواز منتخب کریں:' : 'Select Reciter (Qari):'}</span>
          </div>

          <select
            value={selectedReciterId}
            onChange={(e) => setSelectedReciterId(e.target.value)}
            className="w-full sm:w-auto min-w-[280px] bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {FAMOUS_QURA.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name} ({q.arabicName})
              </option>
            ))}
          </select>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTabFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'urdu' ? 'تمام ۱۱۴ سورتیں' : 'All 114 Surahs'}
            </button>
            <button
              onClick={() => setActiveTabFilter('downloaded')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTabFilter === 'downloaded'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span>{language === 'urdu' ? 'ڈاؤنلوڈ شدہ' : 'Downloaded'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700 text-white font-mono">
                {downloadedAudios.length}
              </span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'urdu' ? 'سورت کا نام تلاش کریں...' : 'Search Surah name or number...'}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Surahs List for Offline Management */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {filteredSurahs.map((surah) => {
            const key = `${surah.number}_${selectedReciter.id}`;
            const isDownloaded = downloadedAudios.some(
              (a) => a.surahNumber === surah.number && a.reciterId === selectedReciter.id
            );
            const isDownloading = downloadProgress[key] !== undefined;
            const progressPct = downloadProgress[key] || 0;
            const isCurrentPlaying = activePlayingSurah === surah.number;

            return (
              <div
                key={surah.number}
                className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                  isDownloaded
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 font-mono text-xs font-black text-slate-700 flex items-center justify-center shrink-0">
                      {surah.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {surah.nameEnglish}
                      </p>
                      <p className="text-[10px] text-emerald-800 font-arabic truncate font-bold">
                        {surah.urduName} ({surah.nameArabic})
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDownloaded ? (
                      <>
                        {/* Play offline audio button */}
                        <button
                          onClick={() => handleTogglePlay(surah.number)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all ${
                            isCurrentPlaying
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          }`}
                          title="Play offline"
                        >
                          {isCurrentPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                          )}
                        </button>

                        {/* Delete offline button */}
                        <button
                          onClick={() => handleDeleteDownload(surah.number)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete from device storage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : isDownloading ? (
                      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>{progressPct}%</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDownloadSingle(surah.number)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-2xs transition-colors active:scale-95"
                        title="Download for offline"
                      >
                        <Download className="w-3 h-3" />
                        <span>ڈاؤنلوڈ</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Download Progress Bar if in progress */}
                {isDownloading && (
                  <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
