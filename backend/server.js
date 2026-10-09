const express = require('express');
const cors = require('cors');

const searchRoute = require('./routes/search');
const streamRoute = require('./routes/stream');
const downloadRoute = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.json({
        name: 'Cymor Tune API',
        status: 'online',
        developer: 'Legendary Smiley Cymor - Cymor Tech Services',
        endpoints: ['/api/search?q=', '/api/stream/audio?url=', '/api/stream/meta?url=', '/api/download/:format?url=']
    });
});

app.use('/api/search', searchRoute);
app.use('/api/stream', streamRoute);
app.use('/api/download', downloadRoute);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`Cymor Tune backend listening on port ${PORT}`);
});
