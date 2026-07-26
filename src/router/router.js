const { Router } = require('express');
const { checkFile, listFiles } = require('../utils/workWithFilesInDir.js');
const { createHtml } = require('../utils/createHtml.js');
const fs = require('fs');

const router = Router();

router.get('/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = await checkFile(filename);

        if (filepath === null) {
            res.status(404).json({ error: 'File not found' }); 
        }

        res.sendFile(filepath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/', async (req, res) => {
    try {
        const files = await listFiles();
        const html = createHtml(files);

        res.send(html);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;