const fs = require('fs').promises;
const path = require('path');

const { FILES_DIR } = require('../config/config.js')

async function checkFile(filename) {
    const filepath = path.join(FILES_DIR, filename);

    const resolvedPath = path.resolve(filepath);
    const resolvedDir = path.resolve(FILES_DIR);

    if (!resolvedPath.startsWith(resolvedDir)) {
        return null;
    }

    try {
        await fs.access(resolvedPath);
        return resolvedPath;
    } catch (err) {
        return null;
    }
}

async function listFiles() {
    try {
        const resolvedDir = path.resolve(FILES_DIR);
        const entries = await fs.readdir(resolvedDir, { withFileTypes: true });

        const files = entries
        .filter(entry => entry.isFile())
        .map(entry => entry.name);

        return files;
    } catch (err) {
        return [];
    }
}

module.exports =  { checkFile, listFiles };