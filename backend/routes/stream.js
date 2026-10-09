const express = require('express');
const axios = require('axios');
const { resolve } = require('../lib/resolver');

const router = express.Router();

// GET /api/stream/audio?url=<youtube-url>
// Proxies the resolved audio file through our server, forwarding the
// Range header both ways so the browser's native <audio> seek bar works.
router.get('/audio', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing "url" query parameter' });

    try {
        const track = await resolve(url, 'mp3');

        const upstream = await axios.get(track.downloadUrl, {
            responseType: 'stream',
            timeout: 120000,
            headers: req.headers.range ? { Range: req.headers.range } : {},
            validateStatus: s => s === 200 || s === 206
        });

        res.status(upstream.status);
        if (upstream.headers['content-range']) res.setHeader('Content-Range', upstream.headers['content-range']);
        if (upstream.headers['content-length']) res.setHeader('Content-Length', upstream.headers['content-length']);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-store');

        upstream.data.pipe(res);
    } catch (error) {
        console.error('[STREAM ERROR]', error.response?.data || error.message);
        res.status(502).json({ error: `Could not stream this track: ${error.message}` });
    }
});

// GET /api/stream/meta?url=<youtube-url> - track title/thumbnail/duration
// without pulling the whole audio file, so the player UI can populate
// instantly while the first audio bytes are still loading.
router.get('/meta', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing "url" query parameter' });

    try {
        const track = await resolve(url, 'mp3');
        res.json({
            title: track.title || 'Unknown title',
            thumbnail: track.thumbnail || null,
            duration: track.duration || null
        });
    } catch (error) {
        res.status(502).json({ error: `Could not resolve this track: ${error.message}` });
    }
});

module.exports = router;
