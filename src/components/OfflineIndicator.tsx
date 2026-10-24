import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle2 } from 'lucide-react';
import { Language } from '../types/index.ts';

interface OfflineIndicatorProps {
  language: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <aside aria-label="Connectivity notification" className="bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-2 transition-all shadow-xs">
        <CheckCircle2 className="w-4 h-4" />
        <span>
          {language === 'urdu'
            ? 'انٹرنیٹ بحال ہو گیا ہے! تمام ڈیٹا ہم آہنگ ہو رہا ہے۔'
            : 'Back Online! All data synced seamlessly.'}
        </span>
      </aside>
    );
  }

  if (isOffline) {
    return (
      <aside aria-label="Connectivity notification" className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          <span>
            {language === 'urdu'
              ? '⚡ آف لائن موڈ فعال ہے! معمولات، تسبیح، ۵ وقت نماز، اور آف لائن پلیئر بغیر انٹرنیٹ چل رہے ہیں۔'
              : '⚡ Offline Mode Active! Daily Routine, Namaz, Nafs Guard & Offline Player work 100% without internet.'}
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
          Play Store App Mode
        </span>
      </aside>
    );
  }

  return null;
};
