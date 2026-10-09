const express = require('express');
const yts = require('yt-search');

const router = express.Router();

router.get('/', async (req, res) => {
    const query = (req.query.q || '').trim();
    if (!query) {
        return res.status(400).json({ error: 'Missing "q" query parameter' });
    }

    try {
        const result = await yts(query);
        const videos = (result.videos || []).slice(0, 25).map(v => ({
            id: v.videoId,
            title: v.title,
            artist: v.author?.name || 'Unknown',
            duration: v.timestamp || '--:--',
            durationSeconds: v.seconds || 0,
            thumbnail: v.thumbnail,
            url: v.url,
            views: v.views || 0
        }));

        res.json({ query, results: videos });
    } catch (error) {
        console.error('[SEARCH ERROR]', error.message);
        res.status(502).json({ error: 'Search failed, try again.' });
    }
});

module.exports = router;
