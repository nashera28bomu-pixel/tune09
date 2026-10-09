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

    if (!response.data || !response.data.status) {
        throw new Error(response.data?.message || `${format.toUpperCase()} conversion failed`);
    }

    const download = response.data.download;
    if (!download || !download.downloadUrl) {
        throw new Error('No download URL returned by the conversion API');
    }

    cache.set(youtubeUrl, { data: download, expiresAt: Date.now() + CACHE_TTL_MS });
    return download;
}

module.exports = { resolve };
