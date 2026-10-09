const express = require('express');
const axios = require('axios');
const { resolve } = require('../lib/resolver');

const router = express.Router();

// GET /api/download/:format(mp3|mp4)?url=<youtube-url>
router.get('/:format', async (req, res) => {
    const { format } = req.params;
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: 'Missing "url" query parameter' });
    if (!['mp3', 'mp4'].includes(format)) return res.status(400).json({ error: 'format must be mp3 or mp4' });

    try {
        const track = await resolve(url, format);

        const upstream = await axios.get(track.downloadUrl, {
            responseType: 'stream',
            timeout: 120000
        });

        const safeTitle = (track.title || 'cymor-tune-track')
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
            .trim()
            .substring(0, 80) || 'track';

        res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${format}"`);
        res.setHeader('Content-Type', format === 'mp3' ? 'audio/mpeg' : 'video/mp4');
        if (upstream.headers['content-length']) res.setHeader('Content-Length', upstream.headers['content-length']);

        upstream.data.pipe(res);
    } catch (error) {
        console.error(`[DOWNLOAD ${format}]`, error.response?.data || error.message);
        res.status(502).json({ error: `Failed to download: ${error.message}` });
    }
});

module.exports = router;
