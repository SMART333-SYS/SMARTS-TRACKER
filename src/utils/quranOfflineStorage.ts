/**
 * Offline storage for Quran Audio and Quran Text using browser IndexedDB.
 * Allows downloading Surah recitations from famous Qura and reading texts completely offline.
 */

const DB_NAME = 'QuranOfflineStore_v1';
const DB_VERSION = 1;
const AUDIO_STORE = 'surah_audio';
const TEXT_STORE = 'surah_text';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: 'key' }); // key: `${surahNumber}_${reciterId}`
      }
      if (!db.objectStoreNames.contains(TEXT_STORE)) {
        db.createObjectStore(TEXT_STORE, { keyPath: 'surahNumber' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface OfflineAudioRecord {
  key: string; // `${surahNumber}_${reciterId}`
  surahNumber: number;
  reciterId: string;
  blob: Blob;
  size: number;
  downloadedAt: number;
}

export interface OfflineTextRecord {
  surahNumber: number;
  ayahs: any[];
  savedAt: number;
}

/**
 * Save an audio blob for a specific surah and reciter into IndexedDB
 */
export async function saveOfflineAudio(
  surahNumber: number,
  reciterId: string,
  blob: Blob
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, 'readwrite');
    const store = tx.objectStore(AUDIO_STORE);
    const key = `${surahNumber}_${reciterId}`;
    const record: OfflineAudioRecord = {
      key,
      surahNumber,
      reciterId,
      blob,
      size: blob.size,
      downloadedAt: Date.now(),
    };

    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get an offline audio Blob for a specific surah and reciter
 */
export async function getOfflineAudioBlob(
  surahNumber: number,
  reciterId: string
): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const store = tx.objectStore(AUDIO_STORE);
      const key = `${surahNumber}_${reciterId}`;
      const req = store.get(key);

      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(req.result.blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Check if a surah has been downloaded for a specific reciter
 */
export async function isSurahAudioDownloaded(
  surahNumber: number,
  reciterId: string
): Promise<boolean> {
  const blob = await getOfflineAudioBlob(surahNumber, reciterId);
  return blob !== null;
}

/**
 * Delete a downloaded audio
 */
export async function deleteOfflineAudio(
  surahNumber: number,
  reciterId: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, 'readwrite');
    const store = tx.objectStore(AUDIO_STORE);
    const key = `${surahNumber}_${reciterId}`;
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get all downloaded audio records (without loading blobs into memory)
 */
export async function getAllDownloadedAudios(): Promise<
  Array<{ key: string; surahNumber: number; reciterId: string; size: number; downloadedAt: number }>
> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const store = tx.objectStore(AUDIO_STORE);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = (req.result || []).map((item) => ({
          key: item.key,
          surahNumber: item.surahNumber,
          reciterId: item.reciterId,
          size: item.size || item.blob?.size || 0,
          downloadedAt: item.downloadedAt || Date.now(),
        }));
        resolve(results);
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Save surah text and translations for offline reading
 */
export async function saveOfflineSurahText(
  surahNumber: number,
  ayahs: any[]
): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TEXT_STORE, 'readwrite');
      const store = tx.objectStore(TEXT_STORE);
      const record: OfflineTextRecord = {
        surahNumber,
        ayahs,
        savedAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}
}

/**
 * Get cached offline surah text
 */
export async function getOfflineSurahText(surahNumber: number): Promise<any[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(TEXT_STORE, 'readonly');
      const store = tx.objectStore(TEXT_STORE);
      const req = store.get(surahNumber);
      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result.ayahs)) {
          resolve(req.result.ayahs);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Format bytes to human readable string (KB / MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
