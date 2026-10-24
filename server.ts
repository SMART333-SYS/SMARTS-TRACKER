import http from 'http';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Cache up to 100 recent search queries for fast repeated lookups
  const searchCache = new Map<
    string,
    {
      timestamp: number;
      data: Array<{
        id: string;
        title: string;
        channel: string;
        duration: string;
        thumbnail: string;
      }>;
    }
  >();

  // Real YouTube Search endpoint that resolves ANY search query
  app.get('/api/youtube-search', async (req, res) => {
    try {
      const q = (req.query.q as string || '').trim();
      if (!q) {
        return res.json({ results: [] });
      }

      // Check cache (15 min validity)
      const cached = searchCache.get(q.toLowerCase());
      if (cached && Date.now() - cached.timestamp < 15 * 60 * 1000) {
        return res.json({ results: cached.data });
      }

      // Fetch directly from YouTube search results without CORS limitations
      const response = await fetch(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );

      const html = await response.text();
      const results: Array<{
        id: string;
        title: string;
        channel: string;
        duration: string;
        thumbnail: string;
      }> = [];

      const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
      if (match) {
        try {
          const data = JSON.parse(match[1]);
          const contents =
            data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer
              ?.contents;
          const itemSection = contents?.find((c: any) => c.itemSectionRenderer)?.itemSectionRenderer;

          itemSection?.contents?.forEach((item: any) => {
            const v = item.videoRenderer;
            if (v && v.videoId && v.videoId.length === 11) {
              const title =
                v.title?.runs?.[0]?.text || v.title?.simpleText || 'YouTube Video';
              const channel =
                v.ownerText?.runs?.[0]?.text ||
                v.shortBylineText?.runs?.[0]?.text ||
                'YouTube Channel';
              const duration = v.lengthText?.simpleText || '';
              const thumbnail =
                v.thumbnail?.thumbnails?.[v.thumbnail.thumbnails.length - 1]?.url ||
                `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;

              results.push({
                id: v.videoId,
                title,
                channel,
                duration,
                thumbnail,
              });
            }
          });
        } catch (parseErr) {
          console.error('Error parsing ytInitialData:', parseErr);
        }
      }

      // Fallback regex if ytInitialData was not matched
      if (results.length === 0) {
        const idMatches = [
          ...new Set([...html.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g)].map((m) => m[1])),
        ];
        for (const vid of idMatches.slice(0, 10)) {
          results.push({
            id: vid,
            title: `YouTube Video (${vid})`,
            channel: 'YouTube',
            duration: '',
            thumbnail: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
          });
        }
      }

      // Maintain cache size
      if (searchCache.size > 100) {
        const firstKey = searchCache.keys().next().value;
        if (firstKey) searchCache.delete(firstKey);
      }
      const finalResults = results.slice(0, 15);
      searchCache.set(q.toLowerCase(), { timestamp: Date.now(), data: finalResults });

      return res.json({ results: finalResults });
    } catch (err: any) {
      console.error('YouTube Search API error:', err.message);
      return res.status(500).json({
        error: 'Failed to search YouTube',
        details: err.message,
        results: [],
      });
    }
  });

  const httpServer = http.createServer(app);

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready on port ${PORT}`);
  });
}

startServer().catch(console.error);
