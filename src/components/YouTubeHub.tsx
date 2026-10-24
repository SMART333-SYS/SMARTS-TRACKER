import React, { useState } from 'react';
import {
  Check,
  Disc3,
  Dumbbell,
  ExternalLink,
  Flame,
  Globe,
  Headphones,
  Maximize2,
  Music,
  Play,
  Radio,
  Search,
  Sparkles,
  Tv,
  Volume2,
  X,
  Youtube,
} from 'lucide-react';
import { Language } from '../types/index.ts';
import { triggerHaptic } from '../utils/audio.ts';
import {
  POPULAR_SONG_CATALOG,
  SongCatalogItem,
} from '../data/songCatalog.ts';
import { searchYouTubeVideos, YouTubeSearchResult } from '../utils/youtubeSearch.ts';

interface YouTubeHubProps {
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  currentVideoId: string;
  currentTitle: string;
  onPlayVideo: (videoId: string, title: string) => void;
  onToggleMiniPlayer: () => void;
  isMiniPlayerOpen: boolean;
  attachedSongTitle?: string;
  onAttachSongToWorkout?: (song: SongCatalogItem) => void;
}

const POPULAR_SEARCH_TAGS = [
  { label: '👑 نصرت فتح علی خان', query: 'Nusrat Fateh Ali Khan Qawwali', color: 'from-amber-500/10 to-yellow-500/10 text-amber-800 border-amber-300 hover:border-amber-400 hover:bg-amber-100/50' },
  { label: '🔥 عمران ہاشمی ہٹس', query: 'Emraan Hashmi songs mashup', color: 'from-rose-500/10 to-red-500/10 text-rose-800 border-rose-300 hover:border-rose-400 hover:bg-rose-100/50' },
  { label: '🎵 کوک اسٹوڈیو', query: 'Coke Studio Pakistan hit songs', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-800 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-100/50' },
  { label: '🎤 عاطف اسلم', query: 'Atif Aslam best songs', color: 'from-indigo-500/10 to-purple-500/10 text-indigo-800 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-100/50' },
  { label: '💪 جم ورک آؤٹ', query: 'High energy gym workout mashup', color: 'from-orange-500/10 to-amber-500/10 text-orange-800 border-orange-300 hover:border-orange-400 hover:bg-orange-100/50' },
  { label: '✨ صوفیانہ کلام', query: 'Soulful Sufi Qawwali Tajdar e Haram', color: 'from-cyan-500/10 to-sky-500/10 text-cyan-800 border-cyan-300 hover:border-cyan-400 hover:bg-cyan-100/50' },
  { label: '🎶 اریجیت سنگھ', query: 'Arijit Singh romantic hits', color: 'from-pink-500/10 to-rose-500/10 text-pink-800 border-pink-300 hover:border-pink-400 hover:bg-pink-100/50' },
];

export const YouTubeHub: React.FC<YouTubeHubProps> = ({
  language,
  hapticEnabled,
  currentVideoId,
  currentTitle,
  onPlayVideo,
  onToggleMiniPlayer,
  isMiniPlayerOpen,
  attachedSongTitle,
  onAttachSongToWorkout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'nusrat' | 'emraan' | 'sufi' | 'gym'
  >('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Perform real YouTube search
  const performSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    triggerHaptic(20, hapticEnabled);
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchYouTubeVideos(q);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    performSearch(searchQuery);
  };

  const handleQuickTagClick = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  // Play song directly in the real YouTube player with audio & video
  const handlePlaySong = (videoId: string, title: string) => {
    triggerHaptic(20, hapticEnabled);
    onPlayVideo(videoId, title);
  };

  // Filter catalog items
  const filterCatalog = () => {
    switch (selectedFilter) {
      case 'nusrat':
        return POPULAR_SONG_CATALOG.filter((s) => s.category === 'Nusrat Fateh Ali Khan');
      case 'emraan':
        return POPULAR_SONG_CATALOG.filter((s) => s.category === 'Emraan Hashmi');
      case 'sufi':
        return POPULAR_SONG_CATALOG.filter(
          (s) => s.category === 'Nasheed' || s.category === 'Sad & Soulful'
        );
      case 'gym':
        return POPULAR_SONG_CATALOG.filter(
          (s) => s.category === 'Gym Mashup' || s.category === 'Punjabi & Pop'
        );
      default:
        return POPULAR_SONG_CATALOG;
    }
  };

  const displayedCatalog = filterCatalog();

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Stylish Gradient Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 border border-white/20">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-black/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-2 shadow-sm border border-white/30">
              <Youtube className="w-3.5 h-3.5 text-white fill-white" />
              <span>{language === 'urdu' ? 'یوٹیوب اصلی پلیئر و سرچ' : 'Real YouTube Player & Search'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
              <Tv className="w-6 h-6 text-amber-200 shrink-0" />
              <span>{language === 'urdu' ? 'یوٹیوب اور چھوٹی اسکرین' : 'YouTube & Choti Screen'}</span>
            </h1>
            <p className="text-xs text-red-50 mt-1.5 max-w-lg leading-relaxed font-medium">
              {language === 'urdu'
                ? 'کوئی بھی گانا یا قوالی سرچ کریں، استاد نصرت فتح علی خان اور عمران ہاشمی کے اصلی گانے اور ویڈیو سنیں۔'
                : 'Search any YouTube song, play original Nusrat Fateh Ali Khan Qawwalis and Emraan Hashmi hits.'}
            </p>
          </div>

          {/* Floating Choti Screen launcher button */}
          <button
            onClick={onToggleMiniPlayer}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95 shrink-0 ${
              isMiniPlayerOpen
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white/70 shadow-amber-500/30'
                : 'bg-white text-red-600 hover:bg-red-50 shadow-black/10'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            <span>
              {isMiniPlayerOpen
                ? language === 'urdu'
                  ? 'چھوٹی اسکرین کھلی ہے'
                  : 'Floating Choti Screen On'
                : language === 'urdu'
                ? 'چھوٹی اسکرین کھولیں'
                : 'Open Choti Screen'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Embedded Video Player (Real YouTube Screen with Full Audio & Video) */}
      <section className="bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
        <div className="bg-slate-900/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
              {currentTitle}
            </span>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${currentVideoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">YouTube پر کھولیں</span>
          </a>
        </div>

        {/* 16:9 Video Frame - Plays Real Video & Sound */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            key={currentVideoId}
            src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
            title={currentTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Player Footer Controls */}
        <div className="p-3 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMiniPlayer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
            >
              <Tv className="w-3.5 h-3.5 text-red-400" />
              <span>{language === 'urdu' ? 'چھوٹی اسکرین الگ کریں' : 'Pop out Choti Screen'}</span>
            </button>

            {onAttachSongToWorkout && (
              <button
                onClick={() => {
                  triggerHaptic(20, hapticEnabled);
                  onAttachSongToWorkout({
                    id: `yt_${currentVideoId}`,
                    title: currentTitle,
                    artist: 'YouTube Audio',
                    category: 'Gym Mashup',
                    youtubeId: currentVideoId,
                    youtubeUrl: `https://youtu.be/${currentVideoId}`,
                    keywords: [],
                    bpm: 126,
                    durationText: 'Live',
                  });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  attachedSongTitle === currentTitle
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>
                  {attachedSongTitle === currentTitle
                    ? language === 'urdu'
                      ? 'ورزش میں لگا دیا ✓'
                      : 'Workout Track ✓'
                    : language === 'urdu'
                    ? 'جم ورزش میں لگائیں'
                    : 'Attach to Gym'}
                </span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400">● اصلی آڈیو و ویڈیو</span>
            <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-400 font-mono text-[10px]">
              {currentVideoId}
            </code>
          </div>
        </div>
      </section>

      {/* 3. Real YouTube Search Engine */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md shadow-slate-100/50 space-y-4">
        <div>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <Search className="w-4 h-4" />
            </span>
            <span>{language === 'urdu' ? 'یوٹیوب پر کوئی بھی گانا یا ویڈیو سرچ کریں' : 'Search Any YouTube Song or Video'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {language === 'urdu'
              ? 'جو گانا چاہیں نام لکھیں یا یوٹیوب لنک ڈالیں، فورا سامنے آ کر پلے ہو جائے گا۔'
              : 'Search by song name, artist, or paste any YouTube URL to play instantly.'}
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'urdu'
                  ? 'گانے یا قوالی کا نام لکھیں (جیسے: Nusrat Dillagi, Emraan Jannat, Atif Aslam)...'
                  : 'Type song name, artist, or YouTube URL (e.g., Nusrat, Emraan Hashmi)...'
              }
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            {isSearching ? (
              <span className="animate-spin inline-block">⏳</span>
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{language === 'urdu' ? 'تلاش کریں' : 'Search'}</span>
          </button>
        </form>

        {/* Suggested Quick Search Tags with colorful pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-slate-400">
            {language === 'urdu' ? 'مشہور سرچز:' : 'Trending:'}
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag.query}
              type="button"
              onClick={() => handleQuickTagClick(tag.query)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r ${tag.color} border transition-all active:scale-95 shadow-2xs hover:shadow-xs`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Real YouTube Search Results Grid */}
        {isSearching && (
          <div className="py-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <span className="animate-spin inline-block text-base">⏳</span>
            <span className="font-semibold">{language === 'urdu' ? 'یوٹیوب سے گانے تلاش کیے جا رہے ہیں...' : 'Searching YouTube for videos...'}</span>
          </div>
        )}

        {!isSearching && hasSearched && searchResults.length === 0 && (
          <div className="py-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200 font-medium">
            <p>{language === 'urdu' ? 'کوئی نتیجہ نہیں ملا۔ نیچے دی گئی فہرست میں سے گانا منتخب کریں۔' : 'No results found. Choose from the curated catalog below.'}</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {language === 'urdu'
                    ? `یوٹیوب سرچ نتائج (${searchResults.length})`
                    : `YouTube Results (${searchResults.length})`}
                </span>
              </h3>
              <button
                onClick={() => {
                  setSearchResults([]);
                  setHasSearched(false);
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition-colors"
              >
                {language === 'urdu' ? 'صاف کریں' : 'Clear results'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {searchResults.map((res) => {
                const isCurrent = currentVideoId === res.id;
                return (
                  <button
                    key={res.id}
                    onClick={() => handlePlaySong(res.id, res.title)}
                    className={`flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all group ${
                      isCurrent
                        ? 'bg-red-50/80 border-red-300 ring-2 ring-red-500/20 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80'
                    }`}
                  >
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200">
                      <img
                        src={res.thumbnail}
                        alt={res.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-white fill-white drop-shadow" />
                      </div>
                      {res.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                          {res.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold line-clamp-2 ${
                          isCurrent ? 'text-red-700' : 'text-slate-900 group-hover:text-red-600'
                        }`}
                      >
                        {res.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                        {res.artistOrUploader}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {isCurrent ? 'چل رہا ہے ▶' : 'اصلی گانا'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 4. Curated Playlists (Nusrat Fateh Ali Khan & Emraan Hashmi) */}
      <section className="space-y-4">
        {/* Category Selector Chips */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                triggerHaptic(15, hapticEnabled);
                setSelectedFilter('all');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {language === 'urdu' ? 'تمام گانے' : 'All Songs'}
            </button>

            <button
              onClick={() => {
                triggerHaptic(15, hapticEnabled);
                setSelectedFilter('nusrat');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedFilter === 'nusrat'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <span>👑</span>
              <span>
                {language === 'urdu'
                  ? 'استاد نصرت فتح علی خان'
                  : 'Nusrat Fateh Ali Khan'}
              </span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(15, hapticEnabled);
                setSelectedFilter('emraan');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedFilter === 'emraan'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25'
                  : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
              }`}
            >
              <span>🔥</span>
              <span>
                {language === 'urdu' ? 'عمران ہاشمی ہٹس' : 'Emraan Hashmi Superhits'}
              </span>
            </button>

            <button
              onClick={() => {
                triggerHaptic(15, hapticEnabled);
                setSelectedFilter('sufi');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${
                selectedFilter === 'sufi'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {language === 'urdu' ? 'صوفیانہ و کلام' : 'Sufi & Coke Studio'}
            </button>

            <button
              onClick={() => {
                triggerHaptic(15, hapticEnabled);
                setSelectedFilter('gym');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${
                selectedFilter === 'gym'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              {language === 'urdu' ? 'جم میش اپ' : 'Gym Workout Mashup'}
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500 px-2.5 py-1 rounded-xl bg-slate-100">
            {displayedCatalog.length} {language === 'urdu' ? 'ٹریکس' : 'Tracks'}
          </span>
        </div>

        {/* Songs Grid - Every item plays real YouTube audio/video */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedCatalog.map((song) => {
            const isPlayingVideo = currentVideoId === song.youtubeId;
            const isNusrat = song.category === 'Nusrat Fateh Ali Khan';
            const isEmraan = song.category === 'Emraan Hashmi';

            return (
              <div
                key={song.id}
                className={`rounded-3xl p-4 border transition-all duration-300 shadow-sm hover:shadow-md ${
                  isPlayingVideo
                    ? 'bg-red-50/70 border-red-400 ring-2 ring-red-500/20 shadow-red-500/10'
                    : isNusrat
                    ? 'bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 border-amber-200/90 hover:border-amber-400'
                    : isEmraan
                    ? 'bg-gradient-to-br from-rose-50/40 via-white to-rose-50/20 border-rose-200/90 hover:border-rose-400'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isNusrat
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isEmraan
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {song.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">
                        {song.durationText}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 truncate">
                      {song.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                      {song.artist}
                    </p>
                    {song.audioNotes && (
                      <p className="text-[10px] text-slate-400 mt-1 italic line-clamp-1">
                        {song.audioNotes}
                      </p>
                    )}
                  </div>

                  {/* YouTube Thumbnail preview with play icon */}
                  <button
                    onClick={() => handlePlaySong(song.youtubeId, song.title)}
                    className="relative w-20 h-14 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200 group shadow-sm active:scale-95 transition-transform"
                    title="Play on YouTube Player"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <Play className="w-5 h-5 text-white fill-white drop-shadow" />
                    </div>
                  </button>
                </div>

                {/* Actions Bar - Direct YouTube Playback */}
                <div className="mt-3 pt-3 border-t border-slate-100/90 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* 1. Play in Video Screen */}
                    <button
                      onClick={() => handlePlaySong(song.youtubeId, song.title)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs active:scale-95 ${
                        isPlayingVideo
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-500/25'
                          : 'bg-slate-900 hover:bg-red-600 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isPlayingVideo ? 'چل رہا ہے ▶' : 'چلائیں اور سنیں'}</span>
                    </button>

                    {/* 2. Pop into Choti Screen */}
                    <button
                      onClick={() => {
                        handlePlaySong(song.youtubeId, song.title);
                        if (!isMiniPlayerOpen) {
                          onToggleMiniPlayer();
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 transition-colors"
                      title="Open in Choti Screen"
                    >
                      <Tv className="w-3.5 h-3.5 text-red-500" />
                      <span>چھوٹی اسکرین</span>
                    </button>
                  </div>

                  {/* 3. Attach to Gym workout */}
                  {onAttachSongToWorkout && (
                    <button
                      onClick={() => {
                        triggerHaptic(15, hapticEnabled);
                        onAttachSongToWorkout(song);
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        attachedSongTitle === song.title
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title="Attach to Workout"
                    >
                      {attachedSongTitle === song.title ? (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Dumbbell className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
