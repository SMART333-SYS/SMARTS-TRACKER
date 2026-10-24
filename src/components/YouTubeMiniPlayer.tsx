import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Maximize2,
  Minimize2,
  Move,
  Play,
  Search,
  Sparkles,
  Tv,
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

export type DockPosition = 'bottom-right' | 'bottom-left' | 'top-right';

interface YouTubeMiniPlayerProps {
  videoId: string;
  videoTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSwitchVideo: (id: string, title: string) => void;
  language: Language;
}

export const YouTubeMiniPlayer: React.FC<YouTubeMiniPlayerProps> = ({
  videoId,
  videoTitle,
  isOpen,
  onClose,
  onSwitchVideo,
  language,
}) => {
  // Docking position persistent across tab navigation
  const [dockPosition, setDockPosition] = useState<DockPosition>(() => {
    try {
      const saved = localStorage.getItem('mr_smart_fitness_dock_pos');
      if (saved === 'bottom-left' || saved === 'top-right' || saved === 'bottom-right') {
        return saved;
      }
    } catch {}
    return 'bottom-right';
  });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('mr_smart_fitness_miniplayer_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [sizeMode, setSizeMode] = useState<'normal' | 'large' | 'compact'>(() => {
    try {
      const saved = localStorage.getItem('mr_smart_fitness_miniplayer_size');
      if (saved === 'normal' || saved === 'large' || saved === 'compact') return saved;
    } catch {}
    return 'normal';
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [showCatalogList, setShowCatalogList] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'nusrat' | 'emraan'>('all');

  // Sync state to localStorage so tab switching never resets docking or state
  useEffect(() => {
    try {
      localStorage.setItem('mr_smart_fitness_dock_pos', dockPosition);
      localStorage.setItem('mr_smart_fitness_miniplayer_collapsed', String(isCollapsed));
      localStorage.setItem('mr_smart_fitness_miniplayer_size', sizeMode);
    } catch {}
  }, [dockPosition, isCollapsed, sizeMode]);

  // Handle YouTube Search in Mini Player
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    triggerHaptic(20);
    setIsSearching(true);
    try {
      const results = await searchYouTubeVideos(inputQuery.trim());
      setSearchResults(results);
      if (results.length > 0) {
        // Automatically switch to first match and play real video & audio
        onSwitchVideo(results[0].id, results[0].title);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  // Position Styling
  const positionClasses = {
    'bottom-right': 'bottom-16 md:bottom-6 right-3 sm:right-6',
    'bottom-left': 'bottom-16 md:bottom-6 left-3 sm:left-6',
    'top-right': 'top-16 md:top-20 right-3 sm:right-6',
  }[dockPosition];

  // Size styling for 16:9 responsive frame
  const sizeClasses = {
    compact: 'w-[270px] sm:w-[290px]',
    normal: 'w-[320px] sm:w-[360px]',
    large: 'w-[350px] sm:w-[450px]',
  }[sizeMode];

  const filteredCatalog =
    catalogFilter === 'nusrat'
      ? POPULAR_SONG_CATALOG.filter((s) => s.category === 'Nusrat Fateh Ali Khan')
      : catalogFilter === 'emraan'
      ? POPULAR_SONG_CATALOG.filter((s) => s.category === 'Emraan Hashmi')
      : POPULAR_SONG_CATALOG.slice(0, 8);

  return (
    <div
      className={`fixed z-50 ${positionClasses} ${sizeClasses} transition-all duration-300 ease-out select-none font-sans`}
      style={{ filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.45))' }}
    >
      <div className="bg-slate-950/95 backdrop-blur-xl rounded-2xl border-2 border-red-500/50 shadow-2xl overflow-hidden text-white">
        {/* Top Header Bar */}
        <div className="px-3 py-2 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-900/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="p-1 rounded-md bg-red-600 text-white shrink-0">
              <Youtube className="w-3.5 h-3.5" />
            </span>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-white tracking-wide truncate">
                  {language === 'urdu' ? 'یوٹیوب چھوٹی اسکرین' : 'Choti Screen'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Dock Position Switcher */}
            <button
              onClick={() => {
                triggerHaptic(15);
                setDockPosition((prev) =>
                  prev === 'bottom-right'
                    ? 'bottom-left'
                    : prev === 'bottom-left'
                    ? 'top-right'
                    : 'bottom-right'
                );
              }}
              title="Move Position"
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <Move className="w-3.5 h-3.5" />
            </button>

            {/* Size Switcher */}
            <button
              onClick={() => {
                triggerHaptic(15);
                setSizeMode((prev) =>
                  prev === 'normal' ? 'large' : prev === 'large' ? 'compact' : 'normal'
                );
              }}
              title="Toggle Size"
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              {sizeMode === 'large' ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Collapse/Expand Toggle */}
            <button
              onClick={() => {
                triggerHaptic(15);
                setIsCollapsed((prev: boolean) => !prev);
              }}
              title={isCollapsed ? 'Expand' : 'Collapse'}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            >
              {isCollapsed ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                triggerHaptic(15);
                onClose();
              }}
              title="Close"
              className="p-1 text-slate-400 hover:text-rose-400 rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsed Bar: Title & Quick Open */}
        {isCollapsed && (
          <div className="px-3 py-2 bg-slate-900 flex items-center justify-between text-xs text-slate-300">
            <span className="truncate pr-2 text-[11px] font-semibold text-slate-200">
              {videoTitle}
            </span>
            <button
              onClick={() => setIsCollapsed(false)}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white shrink-0 hover:bg-red-700 transition-colors"
            >
              کھولیں
            </button>
          </div>
        )}

        {/* Expanded View */}
        {!isCollapsed && (
          <div>
            {/* 16:9 Video Frame - Plays Real Video & Sound */}
            <div className="relative w-full aspect-video bg-black overflow-hidden group">
              <iframe
                key={videoId}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                title={videoTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Currently Playing Info Bar */}
            <div className="px-3 py-1.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{videoTitle}</p>
                <p className="text-[9px] text-emerald-400 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>اصلی یوٹیوب آڈیو اور ویڈیو</span>
                </p>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 shrink-0 p-1 rounded hover:bg-white/5 transition-colors"
                title="Open in YouTube"
              >
                <ExternalLink className="w-3 h-3" />
                <span>YouTube</span>
              </a>
            </div>

            {/* Quick Song Switcher & Search Bar */}
            <div className="p-2.5 bg-slate-950 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      setCatalogFilter('nusrat');
                      setShowCatalogList(true);
                    }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                      catalogFilter === 'nusrat' && showCatalogList
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                    }`}
                  >
                    👑 نصرت فتح علی خان
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic(10);
                      setCatalogFilter('emraan');
                      setShowCatalogList(true);
                    }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                      catalogFilter === 'emraan' && showCatalogList
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-900 text-red-300 hover:bg-slate-800'
                    }`}
                  >
                    🔥 عمران ہاشمی
                  </button>
                </div>

                <button
                  onClick={() => setShowCatalogList((prev) => !prev)}
                  className="text-slate-400 hover:text-white underline text-[10px]"
                >
                  {showCatalogList ? 'چھپائیں' : 'فہرست'}
                </button>
              </div>

              {/* Quick Play Catalog List Dropdown */}
              {showCatalogList && (
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                  {filteredCatalog.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        triggerHaptic(15);
                        onSwitchVideo(item.youtubeId, item.title);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-between gap-2 transition-colors ${
                        videoId === item.youtubeId
                          ? 'bg-red-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <Play className="w-3 h-3 shrink-0 opacity-70 fill-current" />
                    </button>
                  ))}
                </div>
              )}

              {/* Real YouTube Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex gap-1.5">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    language === 'urdu'
                      ? 'یوٹیوب پر کچھ بھی سرچ کریں...'
                      : 'Search any YouTube song...'
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all"
                >
                  {isSearching ? <span className="animate-spin">⏳</span> : <Search className="w-3 h-3" />}
                  <span>{language === 'urdu' ? 'تلاش' : 'Search'}</span>
                </button>
              </form>

              {/* Search results if any */}
              {searchResults.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
                  <p className="text-[9px] font-bold text-slate-400 px-1">تلاش کے نتائج:</p>
                  {searchResults.slice(0, 5).map((sr) => (
                    <button
                      key={sr.id}
                      onClick={() => onSwitchVideo(sr.id, sr.title)}
                      className={`w-full text-left px-2 py-1 rounded text-[10px] flex items-center justify-between gap-1 transition-colors ${
                        videoId === sr.id ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{sr.title}</span>
                      <Play className="w-2.5 h-2.5 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
