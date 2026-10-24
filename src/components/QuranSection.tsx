import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Flame,
  HardDrive,
  Heart,
  Info,
  Loader2,
  Mic,
  Music,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings2,
  Share2,
  Smartphone,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Language, QuranAyah, QuranReciter, QuranSurahMeta } from '../types/index.ts';
import { ALL_114_SURAHS, FAMOUS_QURA, formatSurahDurationEstimate } from '../data/quranData.ts';
import {
  downloadSurahAudio,
  getPlayableAudio,
  getSurahAyahs,
} from '../utils/quranService.ts';
import { deleteOfflineAudio,
  formatBytes,
  getAllDownloadedAudios,
  isSurahAudioDownloaded,
} from '../utils/quranOfflineStorage.ts';
import { triggerHaptic } from '../utils/audio.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface QuranSectionProps {
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  onOpenInstallSection?: () => void;
}

const POPULAR_SURAH_NUMBERS = [1, 18, 36, 55, 56, 67, 112, 113, 114];

export const QuranSection: React.FC<QuranSectionProps> = ({
  language,
  soundEnabled,
  hapticEnabled,
  onOpenInstallSection,
}) => {
  // Navigation & Selected Surah state
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('mr_smart_last_read_surah');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  // Selected Reciter (Qari)
  const [selectedReciterId, setSelectedReciterId] = useState<string>(() => {
    try {
      return localStorage.getItem('mr_smart_selected_qari') || 'alafasy';
    } catch {
      return 'alafasy';
    }
  });

  const selectedReciter = useMemo(() => {
    return FAMOUS_QURA.find((q) => q.id === selectedReciterId) || FAMOUS_QURA[0];
  }, [selectedReciterId]);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'downloaded' | 'popular' | 'meccan' | 'medinan' | 'juz30'>('all');

  // Surah Content state
  const [currentAyahs, setCurrentAyahs] = useState<QuranAyah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);

  // Audio Playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlayingOffline, setIsPlayingOffline] = useState(false);
  const [currentPlayingSurah, setCurrentPlayingSurah] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState(false);

  // Offline Download Tracking state: map of `surah_reciter` -> { downloading: boolean, percent: number }
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloadedAudiosList, setDownloadedAudiosList] = useState<
    Array<{ key: string; surahNumber: number; reciterId: string; size: number }>
  >([]);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState(false);

  // Reader Display Settings
  const [displayMode, setDisplayMode] = useState<'all' | 'urdu' | 'english' | 'arabic-only'>('all');
  const [arabicFontSize, setArabicFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mr_smart_quran_font_size');
      return saved ? parseInt(saved, 10) : 28;
    } catch {
      return 28;
    }
  });

  // Bookmarks
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mr_smart_quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save Qari preference
  useEffect(() => {
    try {
      localStorage.setItem('mr_smart_selected_qari', selectedReciterId);
    } catch {}
  }, [selectedReciterId]);

  // Save Font size
  useEffect(() => {
    try {
      localStorage.setItem('mr_smart_quran_font_size', String(arabicFontSize));
    } catch {}
  }, [arabicFontSize]);

  // Load list of downloaded audios on mount & when changed
  const refreshDownloadedList = async () => {
    const list = await getAllDownloadedAudios();
    setDownloadedAudiosList(list);
  };

  useEffect(() => {
    refreshDownloadedList();
  }, []);

  // Total downloaded size
  const totalDownloadedBytes = useMemo(() => {
    return downloadedAudiosList.reduce((acc, item) => acc + item.size, 0);
  }, [downloadedAudiosList]);

  // Check if a specific Surah is downloaded for currently selected Qari
  const isSurahDownloadedForCurrentQari = (surahNum: number) => {
    return downloadedAudiosList.some(
      (item) => item.surahNumber === surahNum && item.reciterId === selectedReciter.id
    );
  };

  // Load Surah text when selected
  useEffect(() => {
    if (selectedSurahNumber !== null) {
      setLoadingAyahs(true);
      try {
        localStorage.setItem('mr_smart_last_read_surah', String(selectedSurahNumber));
      } catch {}

      getSurahAyahs(selectedSurahNumber).then((ayahs) => {
        setCurrentAyahs(ayahs);
        setLoadingAyahs(false);
      });
    }
  }, [selectedSurahNumber]);

  // Audio setup & cleanup
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };

    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration || 0);
      setAudioLoading(false);
    };

    audio.onwaiting = () => {
      setAudioLoading(true);
    };

    audio.oncanplay = () => {
      setAudioLoading(false);
    };

    audio.onplay = () => {
      setIsPlaying(true);
      setAudioLoading(false);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    audio.onended = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
        // Autoplay next Surah if available
        if (currentPlayingSurah && currentPlayingSurah < 114) {
          playSurahAudio(currentPlayingSurah + 1);
        }
      }
    };

    audio.onerror = () => {
      setAudioLoading(false);
      setIsPlaying(false);
      setAudioError('Failed to stream recitation. Please retry or click Download for offline playback.');
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isLooping]);

  // Play audio for a given Surah
  const playSurahAudio = async (surahNum: number) => {
    if (hapticEnabled) triggerHaptic(15);
    setAudioError(null);
    setAudioLoading(true);
    setCurrentPlayingSurah(surahNum);

    try {
      const { url, isOffline, notDownloadedOffline } = await getPlayableAudio(surahNum, selectedReciter);
      if (notDownloadedOffline) {
        setAudioError(
          language === 'urdu'
            ? '⚠️ یہ سورت ابھی آف لائن ڈاؤن لوڈ نہیں ہے۔ تلاوت سننے کے لیے انٹرنیٹ سے کنیکٹ کریں یا ڈاؤن لوڈ شدہ سورتوں میں سے سنیں۔'
            : '⚠️ This Surah is not downloaded for offline yet. Connect to internet or select from your downloaded Surahs.'
        );
        setAudioLoading(false);
        setIsPlaying(false);
        return;
      }

      setIsPlayingOffline(isOffline);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.playbackRate = playbackSpeed;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      setAudioError(
        language === 'urdu'
          ? 'آڈیو پلے کرنے میں دشواری ہوئی۔ براہ کرم دوبارہ کوشش کریں یا آف لائن ڈاؤن لوڈ کریں۔'
          : 'Unable to start playback. Check internet or download for offline.'
      );
      setAudioLoading(false);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentPlayingSurah) {
        audioRef.current.play().catch(() => {});
      } else if (selectedSurahNumber) {
        playSurahAudio(selectedSurahNumber);
      } else {
        playSurahAudio(1); // Default to Al-Fatiha
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Download Surah Audio
  const handleDownloadSurah = async (surahNum: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (hapticEnabled) triggerHaptic(20);

    const key = `${surahNum}_${selectedReciter.id}`;
    if (downloadProgress[key] !== undefined) return; // already in progress

    setDownloadProgress((prev) => ({ ...prev, [key]: 5 }));

    const res = await downloadSurahAudio(surahNum, selectedReciter, (pct) => {
      setDownloadProgress((prev) => ({ ...prev, [key]: pct }));
    });

    if (res.success) {
      await refreshDownloadedList();
      setTimeout(() => {
        setDownloadProgress((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }, 1000);
    } else {
      alert(`Download failed: ${res.error || 'Check internet connection'}`);
      setDownloadProgress((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  // Delete downloaded audio
  const handleDeleteDownloaded = async (surahNum: number, reciterId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('کیا آپ اس سورت کا آف لائن آڈیو حذف کرنا چاہتے ہیں؟ (Are you sure you want to remove this offline audio?)')) {
      await deleteOfflineAudio(surahNum, reciterId);
      await refreshDownloadedList();
      if (currentPlayingSurah === surahNum && selectedReciter.id === reciterId) {
        setIsPlayingOffline(false);
      }
    }
  };

  // Download all popular Surahs batch
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const handleBatchDownloadPopular = async () => {
    if (hapticEnabled) triggerHaptic(25);
    setIsBatchDownloading(true);

    for (const surahNum of POPULAR_SURAH_NUMBERS) {
      if (!isSurahDownloadedForCurrentQari(surahNum)) {
        await handleDownloadSurah(surahNum);
      }
    }
    setIsBatchDownloading(false);
  };

  // Toggle Bookmark for Ayah
  const toggleBookmark = (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    setBookmarkedAyahs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem('mr_smart_quran_bookmarks', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtered Surahs
  const filteredSurahs = useMemo(() => {
    let list = ALL_114_SURAHS;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.nameEnglish.toLowerCase().includes(q) ||
          s.englishTranslation.toLowerCase().includes(q) ||
          s.nameArabic.includes(q) ||
          s.urduName.includes(q) ||
          String(s.number) === q
      );
    }

    // Tab filter
    if (activeFilter === 'downloaded') {
      list = list.filter((s) => isSurahDownloadedForCurrentQari(s.number));
    } else if (activeFilter === 'popular') {
      list = list.filter((s) => POPULAR_SURAH_NUMBERS.includes(s.number));
    } else if (activeFilter === 'meccan') {
      list = list.filter((s) => s.revelationType === 'Meccan');
    } else if (activeFilter === 'medinan') {
      list = list.filter((s) => s.revelationType === 'Medinan');
    } else if (activeFilter === 'juz30') {
      list = list.filter((s) => s.juzStart === 30);
    }

    return list;
  }, [searchQuery, activeFilter, downloadedAudiosList, selectedReciter.id]);

  const selectedSurahMeta = useMemo(() => {
    if (selectedSurahNumber === null) return null;
    return ALL_114_SURAHS.find((s) => s.number === selectedSurahNumber) || null;
  }, [selectedSurahNumber]);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Banner & Quick Controls */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>القرآن الكريم · The Holy Quran</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>قرآن مجید</span>
              <span className="text-base sm:text-lg font-normal text-emerald-200/80">
                (Read & Recitation)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 max-w-xl">
              114 سورتیں، مستند اردو اور انگلش ترجمہ، مشہور قراء کی روح پرور تلاوت، اور مکمل آف لائن ڈاؤن لوڈ کی سہولت۔
            </p>
          </div>

          {/* Quick Offline Downloads Summary & Modal Button */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsDownloadsModalOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-md"
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>آف لائن سورتیں ({downloadedAudiosList.length})</span>
              <span className="text-[10px] text-emerald-300 font-mono">
                {formatBytes(totalDownloadedBytes)}
              </span>
            </button>
            <button
              onClick={handleBatchDownloadPopular}
              disabled={isBatchDownloading}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
            >
              {isBatchDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>اہم سورتیں محفوظ کریں</span>
            </button>
            {onOpenInstallSection && (
              <button
                onClick={onOpenInstallSection}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                <Smartphone className="w-4 h-4" />
                <span>{language === 'urdu' ? 'ایپ فون میں انسٹال کریں' : 'Install App'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Famous Reciter (Qari) Selector Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>مشہور قاری کا انتخاب کریں (Select Famous Qari):</span>
            </div>

            <div className="relative w-full sm:w-auto min-w-[280px]">
              <select
                aria-label="قاری کا انتخاب کریں (Select Qari)"
                value={selectedReciterId}
                onChange={(e) => {
                  setSelectedReciterId(e.target.value);
                  if (currentPlayingSurah) {
                    playSurahAudio(currentPlayingSurah);
                  }
                }}
                className="w-full bg-emerald-950/80 text-white text-xs sm:text-sm font-semibold rounded-xl px-3 py-2.5 border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer pr-8"
              >
                {FAMOUS_QURA.map((q) => (
                  <option key={q.id} value={q.id} className="bg-slate-900 text-white py-1">
                    {q.name} ({q.arabicName}) - {q.country}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-300">
                ▼
              </div>
            </div>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-2 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{selectedReciter.name}:</span>
            <span>{selectedReciter.styleDescription}</span>
          </p>
        </div>
      </div>

      {/* PWA Install & Offline Quran Features Card */}
      <PWAInstallButton language={language} variant="card" onClickOpenSection={onOpenInstallSection} />

      {/* 2. Persistent Audio Player Card */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 sticky top-16 z-30 backdrop-blur-md bg-white/95 transition-all">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Currently Playing Info */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              {currentPlayingSurah ? currentPlayingSurah : (selectedSurahNumber || 1)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 truncate">
                  {currentPlayingSurah
                    ? ALL_114_SURAHS.find((s) => s.number === currentPlayingSurah)?.nameEnglish
                    : (selectedSurahMeta?.nameEnglish || 'Al-Fatihah')}
                </span>
                <span className="text-xs font-semibold text-emerald-700 font-['Amiri']">
                  {currentPlayingSurah
                    ? ALL_114_SURAHS.find((s) => s.number === currentPlayingSurah)?.nameArabic
                    : (selectedSurahMeta?.nameArabic || 'الفاتحة')}
                </span>
                {isPlayingOffline ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <WifiOff className="w-2.5 h-2.5" />
                    <span>آف لائن پلے</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                    <Wifi className="w-2.5 h-2.5 text-emerald-600" />
                    <span>لائیو سٹریمنگ</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {selectedReciter.name} ({selectedReciter.arabicName})
              </p>
            </div>
          </div>

          {/* Central Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center justify-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                const prevNum = (currentPlayingSurah || selectedSurahNumber || 1) - 1;
                if (prevNum >= 1) playSurahAudio(prevNum);
              }}
              disabled={(currentPlayingSurah || selectedSurahNumber || 1) <= 1}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30"
              title="پچھلی سورت (Previous Surah)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={audioLoading}
              className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 transition-transform active:scale-95 disabled:opacity-50"
            >
              {audioLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => {
                const nextNum = (currentPlayingSurah || selectedSurahNumber || 1) + 1;
                if (nextNum <= 114) playSurahAudio(nextNum);
              }}
              disabled={(currentPlayingSurah || selectedSurahNumber || 1) >= 114}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30"
              title="اگلی سورت (Next Surah)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-xl text-xs transition-colors ${
                isLooping ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="دوبارہ چلائیں (Loop Surah)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Playback speed selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs">
              {[1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Offline download button for currently selected/playing Surah */}
            {(() => {
              const activeSurahNum = currentPlayingSurah || selectedSurahNumber || 1;
              const isDownloaded = isSurahDownloadedForCurrentQari(activeSurahNum);
              const progressKey = `${activeSurahNum}_${selectedReciter.id}`;
              const inProgress = downloadProgress[progressKey] !== undefined;

              return isDownloaded ? (
                <button
                  onClick={(e) => handleDeleteDownloaded(activeSurahNum, selectedReciter.id, e)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
                  title="محفوظ شدہ (کلک کرکے حذف کریں)"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">محفوظ شدہ</span>
                </button>
              ) : (
                <button
                  onClick={(e) => handleDownloadSurah(activeSurahNum, e)}
                  disabled={inProgress}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                  title="آف لائن ڈاؤن لوڈ کریں"
                >
                  {inProgress ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{downloadProgress[progressKey]}%</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">آف لائن سنیں</span>
                    </>
                  )}
                </button>
              );
            })()}
          </div>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-500 min-w-[36px]">
            {formatTime(audioCurrentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={audioDuration || 100}
            value={audioCurrentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-[11px] font-mono text-slate-500 min-w-[36px] text-right">
            {formatTime(audioDuration)}
          </span>
        </div>

        {audioError && (
          <div className="mt-2 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl flex items-center justify-between">
            <span>{audioError}</span>
            <button
              onClick={() => playSurahAudio(currentPlayingSurah || selectedSurahNumber || 1)}
              className="text-emerald-700 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* 3. Conditional View: Either Surah Reader (when a Surah is clicked) OR Surah List (Catalog) */}
      {selectedSurahNumber !== null ? (
        /* SURAH READER VIEW */
        <div className="space-y-6">
          {/* Reader Top Controls */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setSelectedSurahNumber(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>تمام سورتوں کی فہرست (All Surahs)</span>
            </button>

            {/* Surah Title in Center */}
            {selectedSurahMeta && (
              <div className="text-center flex-1 min-w-[200px]">
                <h2 className="text-xl font-bold font-['Amiri'] text-emerald-900">
                  سورة {selectedSurahMeta.nameArabic}
                </h2>
                <p className="text-xs text-slate-500">
                  Surah {selectedSurahMeta.nameEnglish} ({selectedSurahMeta.englishTranslation}) ·{' '}
                  {selectedSurahMeta.numberOfAyahs} آیات · {selectedSurahMeta.revelationType === 'Meccan' ? 'مکی' : 'مدنی'}
                </p>
              </div>
            )}

            {/* Font Size & Display Mode Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 text-xs">
                <button
                  onClick={() => setArabicFontSize(Math.max(22, arabicFontSize - 2))}
                  className="px-2 py-1 rounded bg-white text-slate-700 font-bold hover:bg-slate-50"
                  title="چھوٹا فونٹ"
                >
                  A-
                </button>
                <span className="px-1 text-[11px] font-mono text-slate-500">{arabicFontSize}px</span>
                <button
                  onClick={() => setArabicFontSize(Math.min(42, arabicFontSize + 2))}
                  className="px-2 py-1 rounded bg-white text-slate-700 font-bold hover:bg-slate-50"
                  title="بڑا فونٹ"
                >
                  A+
                </button>
              </div>

              <select
                aria-label="ترجمہ کا انداز منتخب کریں (Select Translation Style)"
                value={displayMode}
                onChange={(e) => setDisplayMode(e.target.value as any)}
                className="bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">مکمل (عربی + اردو + English)</option>
                <option value="urdu">عربی + اردو ترجمہ</option>
                <option value="english">عربی + English Translation</option>
                <option value="arabic-only">صرف عربی (Arabic Only)</option>
              </select>
            </div>
          </div>

          {/* Bismillah Header (except Surah 9 At-Tawbah) */}
          {selectedSurahNumber !== 9 && (
            <div className="text-center py-6 bg-gradient-to-b from-emerald-50/50 to-white rounded-2xl border border-emerald-100 shadow-xs">
              <div className="inline-block px-8 py-3 rounded-2xl bg-white border border-emerald-200/80 shadow-xs">
                <p className="text-2xl sm:text-3xl font-['Amiri'] font-semibold text-emerald-950 tracking-wide">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
                </p>
              </div>
            </div>
          )}

          {/* Ayahs List */}
          {loadingAyahs ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-sm font-semibold">قرآن مجید کی آیات لوڈ ہو رہی ہیں...</p>
            </div>
          ) : currentAyahs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
              <BookOpen className="w-10 h-10 mx-auto text-emerald-600 mb-2 opacity-60" />
              <p className="text-sm font-bold text-slate-800">سورت کا متن دستیاب نہیں</p>
              <p className="text-xs text-slate-500 mt-1">
                براہ کرم انٹرنیٹ بحال کریں یا اوپر پلے بٹن سے تلاوت سنیں۔
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentAyahs.map((ayah) => {
                const isBookmarked = bookmarkedAyahs.includes(
                  `${selectedSurahNumber}:${ayah.numberInSurah}`
                );

                return (
                  <div
                    key={ayah.numberInSurah}
                    id={`ayah-${ayah.numberInSurah}`}
                    className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 hover:border-emerald-300 transition-all group"
                  >
                    {/* Ayah Header: Medallion Number & Bookmark */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shadow-xs">
                          {ayah.numberInSurah}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          آیت نمبر {ayah.numberInSurah}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            toggleBookmark(selectedSurahNumber, ayah.numberInSurah)
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            isBookmarked
                              ? 'text-rose-600 bg-rose-50'
                              : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title="محفوظ / نشان لگائیں"
                        >
                          <Heart
                            className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <p
                      dir="rtl"
                      style={{ fontSize: `${arabicFontSize}px`, lineHeight: 2.2 }}
                      className="font-['Amiri'] font-medium text-slate-900 text-right leading-loose tracking-wide selection:bg-emerald-200"
                    >
                      {ayah.textArabic}{' '}
                      <span className="inline-block text-emerald-700 text-lg mr-1 font-bold">
                        ۝{ayah.numberInSurah}
                      </span>
                    </p>

                    {/* Urdu Translation */}
                    {(displayMode === 'all' || displayMode === 'urdu') && ayah.translationUrdu && (
                      <div dir="rtl" className="mt-4 pt-3 border-t border-slate-100 text-right">
                        <p className="text-emerald-950 font-['Noto_Nastaliq_Urdu'] text-base sm:text-lg leading-relaxed">
                          {ayah.translationUrdu}
                        </p>
                      </div>
                    )}

                    {/* English Translation */}
                    {(displayMode === 'all' || displayMode === 'english') &&
                      ayah.translationEnglish && (
                        <div
                          dir="ltr"
                          className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed"
                        >
                          <p>{ayah.translationEnglish}</p>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Next/Prev Surah Navigator */}
          {selectedSurahMeta && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              {selectedSurahNumber > 1 ? (
                <button
                  onClick={() => setSelectedSurahNumber(selectedSurahNumber - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>پچھلی سورت (#{selectedSurahNumber - 1})</span>
                </button>
              ) : (
                <div />
              )}

              {selectedSurahNumber < 114 ? (
                <button
                  onClick={() => setSelectedSurahNumber(selectedSurahNumber + 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-md shadow-emerald-700/20"
                >
                  <span>اگلی سورت (#{selectedSurahNumber + 1})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      ) : (
        /* SURAH LIST & SEARCH VIEW */
        <div className="space-y-5">
          {/* Search Bar & Filter Buttons */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="سورت کا نام یا نمبر تلاش کریں... (e.g. Yasin, Rahman, Mulk, 36)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'all'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                تمام 114 سورتیں (All)
              </button>

              <button
                onClick={() => setActiveFilter('downloaded')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                  activeFilter === 'downloaded'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>ڈاؤن لوڈ کردہ ({downloadedAudiosList.length})</span>
              </button>

              <button
                onClick={() => setActiveFilter('popular')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                  activeFilter === 'popular'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>مشہور سورتیں (Popular)</span>
              </button>

              <button
                onClick={() => setActiveFilter('juz30')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'juz30'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                پارہ 30 (عمّ پارہ)
              </button>

              <button
                onClick={() => setActiveFilter('meccan')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'meccan'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                مکی سورتیں
              </button>

              <button
                onClick={() => setActiveFilter('medinan')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'medinan'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                مدنی سورتیں
              </button>
            </div>
          </div>

          {/* Surah Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSurahs.map((surah) => {
              const isDownloaded = isSurahDownloadedForCurrentQari(surah.number);
              const progressKey = `${surah.number}_${selectedReciter.id}`;
              const inProgress = downloadProgress[progressKey] !== undefined;
              const isThisPlaying = currentPlayingSurah === surah.number && isPlaying;

              return (
                <div
                  key={surah.number}
                  onClick={() => setSelectedSurahNumber(surah.number)}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Row: Number Star Badge & Arabic Name */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-800 font-black text-xs flex items-center justify-center border border-slate-200 group-hover:border-emerald-200 transition-colors">
                        {surah.number}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-900 transition-colors">
                          {surah.nameEnglish}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {surah.englishTranslation}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-['Amiri'] text-lg font-bold text-emerald-900 block leading-tight">
                        {surah.nameArabic}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {surah.urduName}
                      </span>
                    </div>
                  </div>

                  {/* Middle Meta Info */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium">
                        {surah.revelationType === 'Meccan' ? 'مکی' : 'مدنی'}
                      </span>
                      <span>{surah.numberOfAyahs} آیات</span>
                      <span>· پ {surah.juzStart}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatSurahDurationEstimate(surah.numberOfAyahs)}
                    </span>
                  </div>

                  {/* Bottom Action Buttons: Play Audio & Download Offline */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentPlayingSurah === surah.number && isPlaying) {
                          if (audioRef.current) audioRef.current.pause();
                        } else {
                          playSurahAudio(surah.number);
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        isThisPlaying
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                      }`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>تلاوت سنیں</span>
                        </>
                      )}
                    </button>

                    {/* Download offline button */}
                    {isDownloaded ? (
                      <button
                        onClick={(e) => handleDeleteDownloaded(surah.number, selectedReciter.id, e)}
                        className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                        title="محفوظ شدہ (آف لائن دستیاب - حذف کرنے کے لیے کلک کریں)"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleDownloadSurah(surah.number, e)}
                        disabled={inProgress}
                        className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all disabled:opacity-50"
                        title="آف لائن ڈاؤن لوڈ کریں"
                      >
                        {inProgress ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                            <span className="text-[10px] font-mono">
                              {downloadProgress[progressKey]}%
                            </span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span className="text-[11px]">آف لائن</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">کوئی سورت نہیں ملی</p>
              <p className="text-xs text-slate-400 mt-1">تلاش کے الفاظ بدل کر کوشش کریں۔</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Offline Downloads Management Modal */}
      {isDownloadsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    محفوظ شدہ سورتیں (Offline Downloads)
                  </h3>
                  <p className="text-xs text-slate-500">
                    کل سائز: {formatBytes(totalDownloadedBytes)} · {downloadedAudiosList.length} سورتیں
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDownloadsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              یہ سورتیں آپ کے فون/کمپیوٹر میں براہِ راست محفوظ ہیں۔ انٹرنیٹ یا ڈیٹا نہ ہونے پر بھی کسی تاخیر کے بغیر چلیں گی۔
            </p>

            {/* List of downloaded Surahs */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {downloadedAudiosList.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-slate-600">ابھی تک کوئی سورت ڈاؤن لوڈ نہیں کی گئی</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    سورت کے کارڈ پر موجود 'آف لائن' بٹن پر کلک کریں
                  </p>
                </div>
              ) : (
                downloadedAudiosList.map((item) => {
                  const sMeta = ALL_114_SURAHS.find((s) => s.number === item.surahNumber);
                  const qari = FAMOUS_QURA.find((q) => q.id === item.reciterId);

                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">
                          {item.surahNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-800">
                              {sMeta?.nameEnglish || `Surah ${item.surahNumber}`}
                            </span>
                            <span className="font-['Amiri'] text-xs font-bold text-emerald-800">
                              {sMeta?.nameArabic}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            قاری: {qari?.name || item.reciterId} · {formatBytes(item.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedReciterId(item.reciterId);
                            playSurahAudio(item.surahNumber);
                            setIsDownloadsModalOpen(false);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          title="چلائیں (Play)"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => handleDeleteDownloaded(item.surahNumber, item.reciterId)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="حذف کریں (Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleBatchDownloadPopular}
                disabled={isBatchDownloading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isBatchDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>تمام اہم سورتیں ڈاؤن لوڈ کریں</span>
              </button>

              <button
                onClick={() => setIsDownloadsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                بند کریں (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
