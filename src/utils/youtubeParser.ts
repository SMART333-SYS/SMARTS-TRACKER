import { resolveSongSearch, SongCatalogItem } from '../data/songCatalog.ts';

export interface ParsedYouTubeResult {
  isValid: boolean;
  type: 'video_id' | 'short_url' | 'full_url' | 'embed_url' | 'shorts_url' | 'catalog_search' | 'fallback_search';
  videoId: string;
  displayTitle: string;
  cleanQuery: string;
  originalInput: string;
  resolvedCatalogItem?: SongCatalogItem;
  urlParams?: Record<string, string>;
}

/**
 * Standard YouTube 11-character Base64-like alphanumeric ID pattern
 */
const YT_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Robust extraction of YouTube Video ID from any input:
 * - Full URLs (https://www.youtube.com/watch?v=...)
 * - Shortened links (https://youtu.be/...)
 * - Embed URLs (https://www.youtube.com/embed/...)
 * - Shorts (https://www.youtube.com/shorts/...)
 * - Live streams (https://www.youtube.com/live/...)
 * - Mobile URLs (https://m.youtube.com/...)
 * - Music YouTube (https://music.youtube.com/...)
 * - Raw 11-character video IDs
 */
export function extractYoutubeId(input: string): { id: string | null; type?: ParsedYouTubeResult['type']; params?: Record<string, string> } {
  if (!input) return { id: null };

  let text = input.trim();

  // 1. Strip surrounding HTML iframe or tags if pasted as embed code
  const iframeMatch = text.match(/src=["']([^"']+)["']/i);
  if (iframeMatch) {
    text = iframeMatch[1].trim();
  }

  // 2. Strip Markdown link markup [text](url)
  const mdMatch = text.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/i);
  if (mdMatch) {
    text = mdMatch[1].trim();
  }

  // 3. Remove angle brackets or quotes <https://...>
  text = text.replace(/^[<"']+|[>"']+$/g, '').trim();

  // 4. Decode URI components in case URL is percent-encoded
  try {
    if (text.includes('%3A') || text.includes('%2F') || text.includes('%3F')) {
      text = decodeURIComponent(text);
    }
  } catch {
    // continue with raw text
  }

  // 5. Direct 11-character YouTube video ID
  if (YT_ID_REGEX.test(text)) {
    return { id: text, type: 'video_id' };
  }

  // 6. Normalize URL structure with protocol if omitted (e.g. youtu.be/... or youtube.com/...)
  let urlObj: URL | null = null;
  const hasProtocol = text.startsWith('http://') || text.startsWith('https://');
  const urlCandidate = hasProtocol
    ? text
    : /^([a-zA-Z0-9-]+\.)?(youtu\.be|youtube\.com|youtube-nocookie\.com)/i.test(text)
    ? `https://${text}`
    : null;

  if (urlCandidate) {
    try {
      urlObj = new URL(urlCandidate);
    } catch {
      urlObj = null;
    }
  }

  const collectedParams: Record<string, string> = {};

  if (urlObj) {
    urlObj.searchParams.forEach((val, key) => {
      collectedParams[key] = val;
    });

    const host = urlObj.hostname.toLowerCase().replace(/^www\./, '');
    const pathname = urlObj.pathname;

    // A. Shortened 'youtu.be' links (e.g. https://youtu.be/HeX315M2-OY?si=...)
    if (host === 'youtu.be') {
      const pathSegments = pathname.split('/').filter(Boolean);
      const possibleId = pathSegments[0]?.substring(0, 11);
      if (possibleId && YT_ID_REGEX.test(possibleId)) {
        return { id: possibleId, type: 'short_url', params: collectedParams };
      }
    }

    // B. youtube.com / youtube-nocookie.com / m.youtube.com / music.youtube.com
    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      // 1) Standard /watch?v=VIDEO_ID (supports arbitrary query order)
      const vQuery = urlObj.searchParams.get('v');
      if (vQuery && YT_ID_REGEX.test(vQuery.substring(0, 11))) {
        return { id: vQuery.substring(0, 11), type: 'full_url', params: collectedParams };
      }

      // 2) /embed/VIDEO_ID
      const embedMatch = pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch && YT_ID_REGEX.test(embedMatch[1])) {
        return { id: embedMatch[1], type: 'embed_url', params: collectedParams };
      }

      // 3) /shorts/VIDEO_ID
      const shortsMatch = pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch && YT_ID_REGEX.test(shortsMatch[1])) {
        return { id: shortsMatch[1], type: 'shorts_url', params: collectedParams };
      }

      // 4) /live/VIDEO_ID
      const liveMatch = pathname.match(/\/live\/([a-zA-Z0-9_-]{11})/);
      if (liveMatch && YT_ID_REGEX.test(liveMatch[1])) {
        return { id: liveMatch[1], type: 'full_url', params: collectedParams };
      }

      // 5) /v/VIDEO_ID
      const vMatch = pathname.match(/\/v\/([a-zA-Z0-9_-]{11})/);
      if (vMatch && YT_ID_REGEX.test(vMatch[1])) {
        return { id: vMatch[1], type: 'full_url', params: collectedParams };
      }
    }
  }

  // 7. Regex fallback for edge cases or embedded links in text strings
  const regexPatterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?(?:.*&)?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i,
    /v=([a-zA-Z0-9_-]{11})/i,
  ];

  for (const regex of regexPatterns) {
    const match = text.match(regex);
    if (match && match[1] && YT_ID_REGEX.test(match[1])) {
      return { id: match[1], type: 'full_url', params: collectedParams };
    }
  }

  return { id: null };
}

/**
 * Master parser: Handles URLs, shortened links, direct IDs, and song/search queries.
 * Always resolves to a playable state without crashing or playing silent beats.
 */
export function parseYouTubeInput(rawInput: string): ParsedYouTubeResult {
  const clean = (rawInput || '').trim();

  if (!clean) {
    return {
      isValid: false,
      type: 'fallback_search',
      videoId: 'HeX315M2-OY',
      displayTitle: 'Emraan Hashmi Superhit Mashup',
      cleanQuery: '',
      originalInput: rawInput,
    };
  }

  // 1. Try URL / Direct ID extraction first
  const { id, type, params } = extractYoutubeId(clean);
  if (id) {
    return {
      isValid: true,
      type: type || 'video_id',
      videoId: id,
      displayTitle: `YouTube Track (${id})`,
      cleanQuery: clean,
      originalInput: rawInput,
      urlParams: params,
    };
  }

  // 2. Query is not a URL: Resolve as Song Catalog Search
  const catalogMatch = resolveSongSearch(clean);
  if (catalogMatch) {
    return {
      isValid: true,
      type: 'catalog_search',
      videoId: catalogMatch.youtubeId,
      displayTitle: `${catalogMatch.title} - ${catalogMatch.artist}`,
      cleanQuery: clean,
      originalInput: rawInput,
      resolvedCatalogItem: catalogMatch,
    };
  }

  // 3. Fallback search query: Play default energetic mashup, display search query
  return {
    isValid: true,
    type: 'fallback_search',
    videoId: 'HeX315M2-OY',
    displayTitle: `Playing: "${clean}"`,
    cleanQuery: clean,
    originalInput: rawInput,
  };
}
