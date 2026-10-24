import { QuranAyah, QuranReciter, QuranSurahMeta } from '../types/index.ts';
import { ALL_114_SURAHS, BUNDLED_OFFLINE_SURAHS, FAMOUS_QURA, getSurahAudioUrl } from '../data/quranData.ts';
import {
  getOfflineAudioBlob,
  getOfflineSurahText,
  isSurahAudioDownloaded,
  saveOfflineAudio,
  saveOfflineSurahText,
} from './quranOfflineStorage.ts';

/**
 * In-memory cache for fast tab-switching without re-fetching
 */
const surahMemoryCache = new Map<number, QuranAyah[]>();

/**
 * Fetch Surah text with Arabic, Urdu translation, and English translation
 * Priority order:
 * 1. Memory cache
 * 2. Bundled offline static data
 * 3. IndexedDB local storage cache
 * 4. Online API (AlQuran.cloud multi-edition) -> then save to cache for offline use!
 */
export async function getSurahAyahs(surahNumber: number): Promise<QuranAyah[]> {
  // 1. Check memory cache
  if (surahMemoryCache.has(surahNumber)) {
    return surahMemoryCache.get(surahNumber)!;
  }

  // 2. Check pre-bundled data
  if (BUNDLED_OFFLINE_SURAHS[surahNumber] && BUNDLED_OFFLINE_SURAHS[surahNumber].length > 0) {
    const bundled = BUNDLED_OFFLINE_SURAHS[surahNumber];
    surahMemoryCache.set(surahNumber, bundled);
    return bundled;
  }

  // 3. Check IndexedDB offline storage
  try {
    const cachedText = await getOfflineSurahText(surahNumber);
    if (cachedText && cachedText.length > 0) {
      surahMemoryCache.set(surahNumber, cachedText);
      return cachedText;
    }
  } catch (e) {
    console.warn('Could not read from IndexedDB', e);
  }

  // 4. Fetch from AlQuran Cloud multi-edition endpoint
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ur.jalandhry,en.sahih`
    );
    if (!res.ok) {
      throw new Error(`AlQuran Cloud API returned ${res.status}`);
    }
    const json = await res.json();
    if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 3) {
      const arabicAyahs = json.data[0].ayahs || [];
      const urduAyahs = json.data[1].ayahs || [];
      const englishAyahs = json.data[2].ayahs || [];

      const combined: QuranAyah[] = arabicAyahs.map((ayah: any, index: number) => {
        return {
          numberInSurah: ayah.numberInSurah,
          textArabic: ayah.text,
          translationUrdu: urduAyahs[index]?.text || '',
          translationEnglish: englishAyahs[index]?.text || '',
        };
      });

      // Cache in memory and IndexedDB for offline reading forever!
      surahMemoryCache.set(surahNumber, combined);
      await saveOfflineSurahText(surahNumber, combined);
      return combined;
    }
  } catch (error) {
    console.warn(`Failed to fetch full text for Surah ${surahNumber} from primary API:`, error);
  }

  // Fallback: If network failed and not bundled, create placeholder based on Surah metadata
  const meta = ALL_114_SURAHS.find((s) => s.number === surahNumber);
  const fallbackAyahs: QuranAyah[] = [
    {
      numberInSurah: 1,
      textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translationUrdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
      translationEnglish: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
    {
      numberInSurah: 2,
      textArabic: `${meta ? meta.nameArabic : 'سورة'} - تلاوت شروع کیجیے`,
      translationUrdu: `${meta ? meta.urduName : 'سورت'} کی تلاوت سننے اور آف لائن ڈاؤن لوڈ کے لیے اوپر دیا گیا آڈیو بٹن استعمال کریں۔ انٹرنیٹ بحال ہونے پر مکمل آیات خودکار طور پر محفوظ ہو جائیں گی۔`,
      translationEnglish: `Surah ${meta ? meta.nameEnglish : ''}. Please connect to internet once to cache all verses, or use the audio player above to listen offline.`,
    },
  ];
  return fallbackAyahs;
}

/**
 * Get playable audio source URL (either local blob object URL or CDN URL)
 */
export async function getPlayableAudio(
  surahNumber: number,
  reciter: QuranReciter
): Promise<{ url: string; isOffline: boolean; notDownloadedOffline?: boolean }> {
  try {
    const offlineBlob = await getOfflineAudioBlob(surahNumber, reciter.id);
    if (offlineBlob) {
      const blobUrl = URL.createObjectURL(offlineBlob);
      return { url: blobUrl, isOffline: true };
    }
  } catch (err) {
    console.warn('Error reading offline audio:', err);
  }

  // If device is offline and surah is not cached
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { url: '', isOffline: false, notDownloadedOffline: true };
  }

  // Return direct high quality CDN URL
  const cdnUrl = getSurahAudioUrl(surahNumber, reciter);
  return { url: cdnUrl, isOffline: false };
}

/**
 * Download a Surah audio file for offline listening and save into IndexedDB,
 * while simultaneously caching the full Surah text & translations.
 */
export async function downloadSurahAudio(
  surahNumber: number,
  reciter: QuranReciter,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; size: number; error?: string }> {
  const url = getSurahAudioUrl(surahNumber, reciter);

  try {
    if (onProgress) onProgress(10);

    // Also cache the full text & translation in parallel so reading works offline too!
    getSurahAyahs(surahNumber).catch((err) => {
      console.warn('Could not cache text during audio download:', err);
    });

    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      // Try fallback server
      if (reciter.fallbackServerUrl) {
        const pad = String(surahNumber).padStart(3, '0');
        const fallbackUrl = `${reciter.fallbackServerUrl}${pad}.mp3`;
        const fbRes = await fetch(fallbackUrl, { mode: 'cors' });
        if (fbRes.ok) {
          const blob = await fbRes.blob();
          await saveOfflineAudio(surahNumber, reciter.id, blob);
          if (onProgress) onProgress(100);
          return { success: true, size: blob.size };
        }
      }
      throw new Error(`HTTP error ${response.status}`);
    }

    if (onProgress) onProgress(40);
    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    let blob: Blob;

    if (response.body && totalBytes > 0 && onProgress) {
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          const pct = Math.min(95, Math.round(40 + (receivedBytes / totalBytes) * 55));
          onProgress(pct);
        }
      }
      blob = new Blob(chunks as any, { type: 'audio/mpeg' });
    } else {
      blob = await response.blob();
    }

    if (onProgress) onProgress(98);
    await saveOfflineAudio(surahNumber, reciter.id, blob);
    if (onProgress) onProgress(100);

    return { success: true, size: blob.size };
  } catch (err: any) {
    console.error('Failed to download surah audio:', err);
    return { success: false, size: 0, error: err.message || 'Download failed' };
  }
}

