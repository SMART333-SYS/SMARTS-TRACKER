import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  X,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  HelpCircle,
  WifiOff,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Language } from '../types/index.ts';

interface PWAInstallButtonProps {
  language: Language;
  variant?: 'compact' | 'prominent' | 'card';
  onInstalled?: () => void;
  onClickOpenSection?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  language,
  variant = 'compact',
  onInstalled,
  onClickOpenSection,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideTab, setGuideTab] = useState<'android' | 'ios' | 'desktop'>(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'android';
  });

  const handleInstallClick = async () => {
    if (onClickOpenSection) {
      onClickOpenSection();
      return;
    }
    if (isInstallable) {
      const success = await install();
      if (success && onInstalled) {
        onInstalled();
      }
    } else {
      setShowGuideModal(true);
    }
  };

  // If already running as an installed PWA on home screen, show installed badge in card mode or return null in compact
  if (isInstalled) {
    if (variant === 'card') {
      return (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'urdu'
              ? '✓ ایپ کامیابی سے فون میں انسٹال ہے (مکمل آف لائن تیار)'
              : '✓ App installed on device (Fully offline ready)'}
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {/* 1. COMPACT BUTTON (For Header / Top Bar) */}
      {variant === 'compact' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm transition-all transform active:scale-95 shrink-0"
          title="Install app to your home screen (Works completely offline like Play Store app)"
        >
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">
            {language === 'urdu' ? 'ایپ انسٹال کریں' : 'Install App'}
          </span>
          <span className="sm:hidden">
            {language === 'urdu' ? 'انسٹال' : 'Install'}
          </span>
        </button>
      )}

      {/* 2. PROMINENT BUTTON (For Banners & Actions) */}
      {variant === 'prominent' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>
            {language === 'urdu'
              ? 'فون میں ایپ انسٹال کریں (آف لائن)'
              : language === 'roman-urdu'
              ? 'Phone me App Install karein'
              : 'Install App (Offline Ready)'}
          </span>
        </button>
      )}

      {/* 3. CARD VARIANT (For Settings or Quran offline callout) */}
      {variant === 'card' && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-sm sm:text-base text-white">
                {language === 'urdu' ? 'ایپ اپنے فون میں انسٹال کریں' : 'Install App on Your Phone'}
              </h4>
            </div>
            <p className="text-xs text-emerald-100/80 max-w-md">
              {language === 'urdu'
                ? 'پلے اسٹور کی طرح فون کی اسکرین پر شامل کریں تاکہ قرآن مجید کی سورتیں بغیر انٹرنیٹ چل سکیں۔'
                : 'Add to home screen like a native app. Listen to Quran and track routines completely offline.'}
            </p>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs shadow-lg transition-transform active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'urdu' ? 'ابھی انسٹال کریں' : 'Install Now'}</span>
          </button>
        </div>
      )}

      {/* STEP-BY-STEP INSTALL GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'urdu' ? 'ایپ انسٹال کرنے کا طریقہ' : 'Install Samroot App'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'urdu'
                      ? 'بغیر انٹرنیٹ، تیز رفتار اور فل اسکرین'
                      : 'Zero internet, faster & fullscreen'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setGuideTab('android')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  guideTab === 'android'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Android Phone
              </button>
              <button
                onClick={() => setGuideTab('ios')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  guideTab === 'ios'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                iPhone / iPad
              </button>
              <button
                onClick={() => setGuideTab('desktop')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  guideTab === 'desktop'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Computer / Laptop
              </button>
            </div>

            {/* Android Instructions */}
            {guideTab === 'android' && (
              <div className="space-y-3 py-1">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Chrome مینیو کھولیں</p>
                    <p className="text-slate-500 mt-0.5">
                      اوپر دائیں جانب تین نقطوں <strong>(⋮)</strong> والے مینیو آئیکن پر کلک کریں۔
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">انسٹال منتخب کریں</p>
                    <p className="text-slate-500 mt-0.5">
                      مینیو میں <strong>"Install app"</strong> یا <strong>"Add to Home screen"</strong> دبائیں۔
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">انسٹال تصدیق کریں</p>
                    <p className="text-slate-500 mt-0.5">
                      <strong>"Install"</strong> پر ٹیپ کریں۔ ایپ آپ کی ہوم اسکرین پر آ جائے گی!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* iOS Instructions */}
            {guideTab === 'ios' && (
              <div className="space-y-3 py-1">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">Safari براؤزر میں شیئر دبائیں</p>
                    <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                      نیچے بار میں شیئر آئیکن <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> پر ٹیپ کریں۔
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">ہوم اسکرین میں شامل کریں</p>
                    <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                      تھوڑا نیچے اسکرول کر کے <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" /> <strong>"Add to Home Screen"</strong> منتخب کریں۔
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">شامل کرنے کی تصدیق</p>
                    <p className="text-slate-500 mt-0.5">
                      اوپر دائیں جانب <strong>"Add"</strong> دبائیں، ایپ آپ کے آئی فون میں محفوظ ہو جائے گی۔
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Instructions */}
            {guideTab === 'desktop' && (
              <div className="space-y-3 py-1">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">ایڈریس بار میں انسٹال آئیکن</p>
                    <p className="text-slate-500 mt-0.5">
                      Chrome یا Edge کے ایڈریس بار میں دائیں جانب موجود انسٹال بٹن <strong>(⊕ یا کمپیوٹر آئیکن)</strong> پر کلک کریں۔
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-xs text-slate-700">
                    <p className="font-bold text-slate-900">انسٹال دبائیں</p>
                    <p className="text-slate-500 mt-0.5">
                      <strong>"Install"</strong> بٹن دبائیں۔ ایپ آپ کے کمپیوٹر میں ایک علیحدہ سافٹ ویئر ونڈو کی طرح کھل جائے گی۔
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Offline benefit callout */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
              <WifiOff className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>مکمل آف لائن سہولت:</strong> انسٹالیشن کے بعد انٹرنیٹ یا وائی فائی کے بغیر بھی تمام معمولات اور قرآن مجید کی سورتیں چلیں گی۔
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowGuideModal(false);
                  }}
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md transition-colors"
                >
                  {language === 'urdu' ? 'ابھی ڈائریکٹ انسٹال کریں' : 'Install Directly'}
                </button>
              )}
              <button
                onClick={() => setShowGuideModal(false)}
                className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-colors"
              >
                {language === 'urdu' ? 'سمجھ آ گئی' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
