import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Sparkles, CheckCircle2, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Language } from '../types/index.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface InstallAppBannerProps {
  language: Language;
  onOpenInstallSection?: () => void;
}

export const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ language, onOpenInstallSection }) => {
  const { isInstalled } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mr_smart_install_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('mr_smart_install_banner_dismissed', 'true');
    } catch {}
  };

  // Do not show banner if already running as installed app or dismissed in this session
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-4 py-2.5 shadow-md border-b border-emerald-600/40 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div
          onClick={onOpenInstallSection}
          className="flex items-center gap-2.5 text-center sm:text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide group-hover:text-emerald-300 transition-colors">
                {language === 'urdu'
                  ? '📲 ایپ اپنے فون میں انسٹال کریں (آف لائن استعمال)'
                  : language === 'roman-urdu'
                  ? '📲 App Apne Phone me Install karein (Offline Use)'
                  : '📲 Install App on Your Phone (Works 100% Offline)'}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-semibold">
                <WifiOff className="w-2.5 h-2.5" />
                <span>Zero Internet</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/75 hidden sm:block">
              {language === 'urdu'
                ? 'پلے اسٹور کی طرح موبائل اسکرین پر محفوظ کریں، قرآن مجید کی تلاوت اور معمولات بغیر نیٹ چلیں گے۔'
                : 'Save to home screen like a native app. Listen to Quran and track routines completely offline.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <PWAInstallButton language={language} variant="prominent" onClickOpenSection={onOpenInstallSection} />
          <button
            onClick={handleDismiss}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
