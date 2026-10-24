import React from 'react';
import {
  BookMarked,
  BookOpen,
  CalendarCheck2,
  Compass,
  Dumbbell,
  Flame,
  ShieldAlert,
  Smartphone,
  Timer,
  Youtube,
} from 'lucide-react';
import { Language, TabType } from '../types/index.ts';
import { triggerHaptic } from '../utils/audio.ts';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
}

interface NavItemConfig {
  id: TabType;
  icon: (active: boolean) => React.ReactNode;
  activeGradient: string;
  activeShadow: string;
  badgeColor?: string;
  isSafety?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  language,
}) => {
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'routine':
        return language === 'urdu' ? 'معمولات' : language === 'roman-urdu' ? 'Routine' : 'Routine';
      case 'namaz':
        return language === 'urdu' ? '۵ وقت نماز' : language === 'roman-urdu' ? 'Namaz' : '5 Prayers';
      case 'quran':
        return language === 'urdu' ? 'قرآن مجید' : language === 'roman-urdu' ? 'Quran' : 'Holy Quran';
      case 'dua':
        return language === 'urdu' ? 'دعائیں' : language === 'roman-urdu' ? 'Duain' : 'Daily Dua';
      case 'gym':
        return language === 'urdu' ? 'جم فٹنس' : language === 'roman-urdu' ? 'Gym Workout' : 'Gym';
      case 'timer':
        return language === 'urdu' ? 'ٹائمر' : language === 'roman-urdu' ? 'Timer' : 'Timer';
      case 'youtube':
      case 'music':
      case 'audioplayer':
        return language === 'urdu' ? 'یوٹیوب' : language === 'roman-urdu' ? 'YouTube' : 'YouTube';
      case 'tasbeeh':
        return language === 'urdu' ? 'تسبیح' : language === 'roman-urdu' ? 'Tasbeeh' : 'Tasbeeh';
      case 'safety':
        return language === 'urdu' ? 'نفس گارڈ' : language === 'roman-urdu' ? 'Nafs Guard' : 'Safety Guard';
      case 'install':
        return language === 'urdu' ? '📲 انسٹال و ڈاؤنلوڈ' : language === 'roman-urdu' ? '📲 Install & Offline' : '📲 Install App';
    }
  };

  const navItems: NavItemConfig[] = [
    {
      id: 'routine',
      icon: (active) => (
        <CalendarCheck2 className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-emerald-600'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
      activeShadow: 'shadow-md shadow-emerald-500/30',
    },
    {
      id: 'namaz',
      icon: (active) => (
        <Compass className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-sky-600'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
      activeShadow: 'shadow-md shadow-sky-500/30',
    },
    {
      id: 'quran',
      icon: (active) => (
        <BookOpen className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-emerald-700'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white',
      activeShadow: 'shadow-md shadow-emerald-600/30',
    },
    {
      id: 'dua',
      icon: (active) => (
        <BookMarked className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-indigo-600'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
      activeShadow: 'shadow-md shadow-indigo-500/30',
    },
    {
      id: 'gym',
      icon: (active) => (
        <Dumbbell className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-orange-500'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white',
      activeShadow: 'shadow-md shadow-orange-500/30',
    },
    {
      id: 'timer',
      icon: (active) => (
        <Timer className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-rose-500'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white',
      activeShadow: 'shadow-md shadow-rose-500/30',
    },
    {
      id: 'youtube',
      icon: (active) => (
        <Youtube className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-red-600'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-red-600 to-rose-700 text-white',
      activeShadow: 'shadow-md shadow-red-600/30',
    },
    {
      id: 'tasbeeh',
      icon: (active) => (
        <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-amber-500'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
      activeShadow: 'shadow-md shadow-amber-500/30',
    },
    {
      id: 'safety',
      icon: (active) => (
        <ShieldAlert className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-rose-600 animate-pulse'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-rose-600 to-red-700 text-white',
      activeShadow: 'shadow-md shadow-rose-600/40',
      isSafety: true,
    },
    {
      id: 'install',
      icon: (active) => (
        <Smartphone className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? 'text-white' : 'text-cyan-600'}`} />
      ),
      activeGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white',
      activeShadow: 'shadow-md shadow-emerald-600/30',
    },
  ];

  const handleTabClick = (tab: TabType) => {
    triggerHaptic(15);
    onTabChange(tab);
  };

  return (
    <>
      {/* Desktop Segmented Navigation Bar */}
      <div className="hidden md:flex items-center justify-center py-2.5 px-4 bg-gradient-to-b from-white to-slate-50/80 border-b border-slate-200/80">
        <div className="inline-flex p-1.5 bg-slate-100/90 backdrop-blur-md rounded-2xl max-w-5xl w-full justify-between gap-1.5 shadow-inner border border-slate-200/70 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? `${item.activeGradient} ${item.activeShadow} scale-[1.02]`
                    : item.isSafety
                    ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {item.icon(isActive)}
                <span>{getTabLabel(item.id)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Tab Bar (Ergonomic Thumb Reach Zone, Colorful, Tactile) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl h-16 pb-safe"
      >
        <div className="flex items-center justify-around h-full px-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 min-h-[44px] min-w-[50px] flex-1 transition-all duration-200 active:scale-90 ${
                  isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? `${item.activeGradient} ${item.activeShadow}`
                      : 'bg-slate-100/70 text-slate-500'
                  }`}
                >
                  {item.icon(isActive)}
                </div>
                <span
                  className={`text-[9.5px] tracking-tight mt-0.5 truncate max-w-[58px] ${
                    isActive ? 'font-black text-slate-900' : 'font-medium text-slate-500'
                  }`}
                >
                  {getTabLabel(item.id)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
