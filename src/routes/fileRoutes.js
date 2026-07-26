const { Router } = require('express');
const { checkFile, listFiles } = require('../utils/fileUtils.js');
const { createFilesHtml, createJokesHtml, createCatImageHtml } = require('../utils/htmlUtils.js');

const router = Router();

router.get('/jokes', async (req, res) => {
    try {
        const response = await fetch("https://www.anekdot.ru/random/anekdot/");
        const srcHtml = await response.text();

        const dstHtml = createJokesHtml(srcHtml);

        res.send(dstHtml);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/cat', async (req, res) => {
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search");
        const data = await response.json();
        const catImageUrl = data[0].url;

        const html = createCatImageHtml(catImageUrl);

        res.send(html);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = await checkFile(filename);

        if (filepath === null) {
            return res.status(404).json({ error: 'File not found' }); 
        }

        res.sendFile(filepath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/', async (req, res) => {
    try {
        const files = await listFiles();
        const html = createFilesHtml(files);

        res.send(html);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;