const fs = require('fs').promises;
const path = require('path');

const { FILES_DIR } = require('../config/config.js');

const safeBaseDir = FILES_DIR.endsWith(path.sep)
    ? FILES_DIR
    : FILES_DIR + path.sep;

async function checkFile(filename) {
    const normalizedFilename = path.normalize(filename).replace(/^(\.\.[\/\\])+/, '');
    const filepath = path.join(FILES_DIR, normalizedFilename);

    if (!filepath.startsWith(safeBaseDir) && filepath !== FILES_DIR) {
        return null;
    }

    try {
        await fs.access(filepath);
        return filepath;
    } catch (err) {
        return null;
    }
}

async function listFiles() {
    try {
        const entries = await fs.readdir(FILES_DIR, { withFileTypes: true });

        return entries
            .filter(entry => entry.isFile())
            .map(entry => entry.name);
    } catch (err) {
        console.error('Error listing files:', err);
        return [];
    }
}

module.exports = { checkFile, listFiles };