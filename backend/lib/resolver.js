const axios = require('axios');

const API_BASE = process.env.DOWNLOAD_API_BASE || 'https://eliteprotech-apis.zone.id';
const TIMEOUT = 120000;
const CACHE_TTL_MS = 50 * 60 * 1000; // 50 minutes - stays under most signed-URL expiries

// url -> { data: { downloadUrl, title, thumbnail, duration }, expiresAt }
const mp3Cache = new Map();
const mp4Cache = new Map();

function getCache(format) {
    return format === 'mp4' ? mp4Cache : mp3Cache;
}

function pruneExpired(cache) {
    const now = Date.now();
    for (const [key, entry] of cache) {
        if (entry.expiresAt < now) cache.delete(key);
    }
}

/**
 * Resolves a YouTube URL to a direct, time-limited download URL via the
 * EliteProTech API, caching the result briefly so repeated calls (e.g. a
 * browser doing several Range-request chunks while seeking) don't each
 * trigger a fresh conversion.
 */
async function resolve(youtubeUrl, format = 'mp3') {
    const cache = getCache(format);
    pruneExpired(cache);

    const cached = cache.get(youtubeUrl);
    if (cached) return cached.data;

    const endpoint = format === 'mp4' ? '/download/ytmp4' : '/download/ytmp3';
    const response = await axios.get(`${API_BASE}${endpoint}`, {
        params: { url: youtubeUrl },
        timeout: TIMEOUT
    });

    if (!response.data || response.data.status === false) {
        throw new Error(response.data?.message || `${format.toUpperCase()} conversion failed`);
    }

    const download = extractDownload(response.data);
    if (!download) {
        // Self-diagnosing: if the API's response shape ever drifts again
        // (confirmed to happen between the mp3 and mp4 endpoints already),
        // this dumps the actual shape into the error instead of a generic
        // "no URL" message, so the fix is a 2-minute lookup, not a guess.
        const preview = JSON.stringify(response.data).slice(0, 500);
        throw new Error(`Unrecognized API response shape for ${format}: ${preview}`);
    }

    cache.set(youtubeUrl, { data: download, expiresAt: Date.now() + CACHE_TTL_MS });
    return download;
}

/**
 * The EliteProTech API doesn't use a consistent response shape across its
 * endpoints (confirmed: ytmp3 nests under `download`, ytmp4 may not). This
 * checks every field-name/nesting variant seen across similar download
 * APIs so one resolver handles both without needing per-format branching.
 */
function extractDownload(body) {
    const candidates = [
        body?.download,
        body?.result,
        body?.data,
        body
    ];

    for (const c of candidates) {
        if (!c || typeof c !== 'object') continue;
        const url = c.downloadUrl || c.download_url || c.url || c.link || c.video || c.audio || c.mp4 || c.mp3;
        if (url && typeof url === 'string' && url.startsWith('http')) {
            return {
                downloadUrl: url,
                title: c.title || c.name || body?.title || 'Unknown title',
                thumbnail: c.thumbnail || c.thumb || c.image || body?.thumbnail || null,
                duration: c.duration || c.length || body?.duration || null
            };
        }
    }
    return null;
}

module.exports = { resolve };
