const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const rootDir = path.join(__dirname, '..');

module.exports = {
    PORT: process.env.PORT || 8080,
    FILES_DIR: process.env.FILES_DIR 
        ? path.join(rootDir, process.env.FILES_DIR) 
        : path.join(rootDir, 'static')
};