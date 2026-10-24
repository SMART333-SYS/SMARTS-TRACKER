import React, { useState, useEffect } from 'react';
import { Check, Disc3, ExternalLink, FastForward, Heart, Music, Pause, Play, Plus, Radio, Rewind, Sparkles, Tv, Volume2, VolumeX, Youtube } from 'lucide-react';
import { Language, MusicTrack } from '../types/index.ts';
import { soundManager, triggerHaptic } from '../utils/audio.ts';

export const WORKOUT_TRACKS: MusicTrack[] = [
  {
    id: 'emraan_hashmi_mashup_1',
    title: 'Emraan Hashmi Hits - Superhit Mashup Vol 1',
    artistOrType: 'Emraan Hashmi Best Mashup (Zara Sa · Toh Phir Aao · Woh Lamhe · Jannat)',
    bpm: 126,
    genre: 'Epic Mashup',
    durationSeconds: 380,
    energyLevel: 'High',
    description: 'Iconic Emraan Hashmi emotional & high-energy workout mashup featuring Zara Sa, Toh Phir Aao, Woh Lamhe, Tu Hi Meri Shab Hai, and Hale Dil.',
    youtubeId: 'UbuhuRVoieA',
    youtubeUrl: 'https://youtu.be/UbuhuRVoieA',
  },
  {
    id: 'emraan_hashmi_mashup_2',
    title: 'Emraan Hashmi Mega Mashup Vol 2',
    artistOrType: 'Emraan Hashmi Ultimate Hits (Dil Sambhal Ja Zara · Tu Hi Haqeeqat · Phir Mohabbat)',
    bpm: 128,
    genre: 'Epic Mashup',
    durationSeconds: 429,
    energyLevel: 'High',
    description: 'Ultimate Emraan Hashmi Bollywood gym playlist with heavy bass & driving tempo for high endurance training.',
    youtubeId: 'xDn-3GYbRQQ',
    youtubeUrl: 'https://youtu.be/xDn-3GYbRQQ',
  },
  {
    id: 'track_1',
    title: 'Iron Faith - High Energy Mashup',
    artistOrType: 'Gym Nasheed & Electronic Duff Mashup',
    bpm: 128,
    genre: 'Epic Mashup',
    durationSeconds: 180,
    energyLevel: 'Explosive',
    description: 'High tempo 128 BPM rhythmic drive with uplifting melodic minor hooks for bench & push days.',
  },
  {
    id: 'track_2',
    title: 'Al-Qawi (The Strong) - Power Beat',
    artistOrType: 'Heavy Barbell & Duff Rhythm',
    bpm: 135,
    genre: 'Heavy Lift',
    durationSeconds: 210,
    energyLevel: 'High',
    description: 'Driving 135 BPM rhythm designed for max effort deadlifts, squats, and PR attempts.',
  },
  {
    id: 'track_3',
    title: 'Cardio Pulse - 140 BPM Duff & Rhythm',
    artistOrType: 'High Cadence Stamina Beat',
    bpm: 140,
    genre: 'Cardio Duff',
    durationSeconds: 240,
    energyLevel: 'Explosive',
    description: 'Relentless 140 BPM cadence for sprinting, treadmill intervals, and HIIT circuit rounds.',
  },
  {
    id: 'track_4',
    title: 'Focus & Resilience - Ambient Flow',
    artistOrType: 'Spiritual Mental Clarity & Bass',
    bpm: 115,
    genre: 'Ambient Power',
    durationSeconds: 195,
    energyLevel: 'Calm Focus',
    description: 'Deep resonant frequencies for stretching, mind-muscle connection, and calisthenics.',
  },
  {
    id: 'track_5',
    title: 'Tahajjud & Steel - Midnight Intensity',
    artistOrType: 'Melodic Minor Motivational Flow',
    bpm: 122,
    genre: 'Epic Mashup',
    durationSeconds: 200,
    energyLevel: 'Medium',
    description: 'Clean acoustic harmonics paired with steady heartbeat rhythm for late night or early morning sessions.',
  },
];

interface WorkoutMusicPlayerProps {
  language: Language;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  selectedTrackTitle: string;
  onSelectTrackForWorkout: (track: MusicTrack) => void;
  onPopOutMiniPlayer?: (id: string, title: string) => void;
}

export const WorkoutMusicPlayer: React.FC<WorkoutMusicPlayerProps> = ({
  language,
  soundEnabled,
  hapticEnabled,
  selectedTrackTitle,
  onSelectTrackForWorkout,
  onPopOutMiniPlayer,
}) => {
  const [tracksList, setTracksList] = useState<MusicTrack[]>(WORKOUT_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideoEmbed, setShowVideoEmbed] = useState(true);

  // Custom song modal state
  const [customSongInput, setCustomSongInput] = useState('');
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');
  const [customBpmInput, setCustomBpmInput] = useState(128);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const activeTrack = tracksList[currentTrackIndex] || tracksList[0];

  // Subscribe to Web Audio step beats for animated equalizer
  useEffect(() => {
    soundManager.setMusicBeatCallback((step) => {
      setCurrentStep(step);
    });
    return () => {
      soundManager.setMusicBeatCallback(null);
    };
  }, []);

  const handleTogglePlay = () => {
    triggerHaptic(20, hapticEnabled);
    soundManager.stopWorkoutMusic();
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    triggerHaptic(15, hapticEnabled);
    soundManager.stopWorkoutMusic();
    const nextIdx = (currentTrackIndex + 1) % tracksList.length;
    setCurrentTrackIndex(nextIdx);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    triggerHaptic(15, hapticEnabled);
    soundManager.stopWorkoutMusic();
    const prevIdx = (currentTrackIndex - 1 + tracksList.length) % tracksList.length;
    setCurrentTrackIndex(prevIdx);
    setIsPlaying(true);
  };

  const handleSelectTrack = (idx: number) => {
    triggerHaptic(20, hapticEnabled);
    soundManager.stopWorkoutMusic();
    setCurrentTrackIndex(idx);
    setIsPlaying(true);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    soundManager.setMusicVolume(newVol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      soundManager.setMusicVolume(volume);
    } else {
      setIsMuted(true);
      soundManager.setMusicVolume(0);
    }
  };

  const handleAttachTrack = (track: MusicTrack) => {
    triggerHaptic(25, hapticEnabled);
    soundManager.playTap(soundEnabled);
    onSelectTrackForWorkout(track);
  };

  // Extract YouTube ID from link
  const extractYoutubeId = (url: string): string | undefined => {
    if (!url) return undefined;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : undefined;
  };

  const handleAddCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSongInput.trim()) return;

    const ytId = extractYoutubeId(customYoutubeUrl.trim());
    const customTrack: MusicTrack = {
      id: `custom_${Date.now()}`,
      title: customSongInput.trim(),
      artistOrType: ytId ? 'YouTube Mashup / Music Track' : 'Custom Workout Song',
      bpm: Number(customBpmInput) || 128,
      genre: 'Epic Mashup',
      durationSeconds: 240,
      energyLevel: 'High',
      description: 'Custom added workout mashup track.',
      youtubeId: ytId,
      youtubeUrl: customYoutubeUrl.trim() || undefined,
    };

    setTracksList((prev) => [customTrack, ...prev]);
    setCurrentTrackIndex(0);
    onSelectTrackForWorkout(customTrack);
    setCustomSongInput('');
    setCustomYoutubeUrl('');
    setShowCustomModal(false);
  };

  const isCurrentAttached = selectedTrackTitle === activeTrack.title;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>
              {language === 'urdu'
                ? 'عمران ہاشمی گانے اور ورزش میش اپ'
                : language === 'roman-urdu'
                ? 'Emraan Hashmi & Workout Mashup Station'
                : 'Workout Music & Mashup Station'}
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'urdu'
              ? 'یوٹیوب میش اپ، پرجوش گانے اور ورزش کے لیے تال و ردم'
              : 'Emraan Hashmi mashup, YouTube workout beats aur songs ka mukammal portal.'}
          </p>
        </div>

        {/* Custom Song Tracker Button */}
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'urdu' ? 'نیا یوٹیوب گانا شامل کریں' : 'Add YouTube / Song'}</span>
        </button>
      </div>

      {/* Featured Emraan Hashmi Quick Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded text-rose-100">
                Featured YouTube Workout Mashups
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                Emraan Hashmi Superhit Mashups
              </h4>
              <p className="text-xs text-rose-100/90">
                Woh Lamhe · Zara Sa · Toh Phir Aao · Dil Sambhal Ja Zara · Jannat
              </p>
            </div>
          </div>
        </div>

        {/* Quick Launch Buttons for Both Volumes */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
          <button
            onClick={() => {
              triggerHaptic(20, hapticEnabled);
              const idx = tracksList.findIndex((t) => t.id === 'emraan_hashmi_mashup_1');
              if (idx !== -1) {
                setCurrentTrackIndex(idx);
                setShowVideoEmbed(true);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTrack.id === 'emraan_hashmi_mashup_1'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'bg-black/20 hover:bg-black/30 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Vol 1: Woh Lamhe & Zara Sa</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(20, hapticEnabled);
              const idx = tracksList.findIndex((t) => t.id === 'emraan_hashmi_mashup_2');
              if (idx !== -1) {
                setCurrentTrackIndex(idx);
                setShowVideoEmbed(true);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTrack.id === 'emraan_hashmi_mashup_2'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'bg-black/20 hover:bg-black/30 text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Vol 2: Mega Mashup</span>
          </button>

          <a
            href={activeTrack.youtubeUrl || 'https://youtu.be/HeX315M2-OY'}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-rose-100 hover:text-white flex items-center gap-1 underline"
          >
            <span>Open Current on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Player Display (YouTube Video Embed or Audio Equalizer) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-5">
        {/* If Active Track has a YouTube ID and Video mode is enabled */}
        {activeTrack.youtubeId && showVideoEmbed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <Youtube className="w-4 h-4" />
                <span>YouTube Embedded Player</span>
              </span>
              <div className="flex items-center gap-2">
                {onPopOutMiniPlayer && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(20);
                      onPopOutMiniPlayer(activeTrack.youtubeId!, activeTrack.title);
                    }}
                    className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                    title="Floating Picture-in-Picture window inside app"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>{language === 'urdu' ? 'چھوٹی اسکرین میں کھولیں' : 'Choti Screen'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowVideoEmbed(false)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Synth Mode
                </button>
                <span>·</span>
                <a
                  href={activeTrack.youtubeUrl || `https://youtu.be/${activeTrack.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Responsive 16:9 YouTube iFrame Embed for Real Song Playback */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-xl">
              <iframe
                key={activeTrack.youtubeId + (isPlaying ? '-play' : '-pause')}
                src={`https://www.youtube.com/embed/${activeTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&playsinline=1`}
                title={activeTrack.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : (
          /* Audio Cassette & Live Equalizer View */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="relative flex items-center justify-center shrink-0">
              <div
                className={`w-24 h-24 rounded-full bg-radial from-slate-800 to-black border-4 border-slate-700/80 shadow-xl flex items-center justify-center ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '4s' }}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                  <Music className="w-4 h-4 text-slate-950" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border border-slate-600/30 pointer-events-none" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeTrack.genre}
                </span>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {activeTrack.bpm} BPM
                </span>
                {activeTrack.youtubeId && (
                  <button
                    type="button"
                    onClick={() => setShowVideoEmbed(true)}
                    className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 underline font-semibold"
                  >
                    <Tv className="w-3 h-3" />
                    <span>Watch Video</span>
                  </button>
                )}
              </div>

              <h4 className="text-lg font-bold text-white truncate tracking-tight">
                {activeTrack.title}
              </h4>
              <p className="text-xs text-slate-300 truncate">
                {activeTrack.artistOrType}
              </p>

              {/* 16-Bar Audio Equalizer */}
              <div className="flex items-end justify-center sm:justify-start gap-1 pt-2 h-7">
                {Array.from({ length: 16 }).map((_, i) => {
                  const isActiveStep = currentStep === i && isPlaying;
                  const barHeight = isPlaying
                    ? isActiveStep
                      ? 24
                      : Math.max(6, (Math.sin(i * 1.2 + currentStep) * 0.5 + 0.5) * 20)
                    : 4;
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        isActiveStep
                          ? 'bg-emerald-400'
                          : isPlaying
                          ? 'bg-emerald-600/70'
                          : 'bg-slate-700'
                      }`}
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Track Action & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          {/* Audio Synthesizer Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevTrack}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors active:scale-95"
              title="Previous Track"
            >
              <Rewind className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 transition-all"
              title={isPlaying ? 'Pause Synthesizer Beat' : 'Play Synthesizer Beat'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            <button
              onClick={handleNextTrack}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors active:scale-95"
              title="Next Track"
            >
              <FastForward className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 ml-2">
              <button onClick={handleToggleMute} className="hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Attach to Workout Button */}
          <button
            onClick={() => handleAttachTrack(activeTrack)}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
              isCurrentAttached
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isCurrentAttached ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isCurrentAttached ? 'Attached to Workout Log' : 'Attach Song to Workout'}</span>
          </button>
        </div>
      </div>

      {/* Tracklist Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-700 block">
          {language === 'urdu' ? 'میش اپ اور گانوں کی فہرست:' : 'Workout Mashups & Songs Library:'}
        </span>
        <div className="space-y-2">
          {tracksList.map((track, idx) => {
            const isSelected = idx === currentTrackIndex;
            const isAttached = selectedTrackTitle === track.title;
            const isEmraan = track.id === 'emraan_hashmi_mashup';

            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(idx)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900 font-semibold shadow-xs'
                    : isEmraan
                    ? 'bg-rose-50/50 hover:bg-rose-50 border-rose-200 text-slate-800'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isEmraan
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isEmraan ? <Youtube className="w-4 h-4" /> : `0${idx + 1}`}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold block truncate text-slate-900">
                        {track.title}
                      </span>
                      {isEmraan && (
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                          YouTube Mashup
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {track.artistOrType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {track.youtubeUrl && (
                    <a
                      href={track.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Open Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {isAttached && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      Workout Song
                    </span>
                  )}
                  {isSelected && isPlaying && (
                    <span className="text-[10px] text-emerald-600 font-bold uppercase animate-pulse">
                      Playing
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Custom Song Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleAddCustomSong}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">
                {language === 'urdu' ? 'نیا یوٹیوب گانا یا میش اپ درج کریں' : 'Add YouTube Song or Mashup'}
              </h4>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Song / Mashup Title:
              </label>
              <input
                type="text"
                value={customSongInput}
                onChange={(e) => setCustomSongInput(e.target.value)}
                placeholder="e.g. Emraan Hashmi Gym Mashup, Woh Lamhe, etc."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                YouTube URL (optional):
              </label>
              <input
                type="text"
                value={customYoutubeUrl}
                onChange={(e) => setCustomYoutubeUrl(e.target.value)}
                placeholder="https://youtu.be/HeX315M2-OY"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated BPM / Tempo:
              </label>
              <input
                type="number"
                min="60"
                max="220"
                value={customBpmInput}
                onChange={(e) => setCustomBpmInput(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
              >
                Add Track
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
