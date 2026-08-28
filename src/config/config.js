const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const rootDir = path.join(__dirname, '..', '..');

module.exports = {
    PORT: process.env.PORT || 8080,
    FILES_DIR: process.env.FILES_DIR
        ? path.join(rootDir, process.env.FILES_DIR)
        : path.join(rootDir, 'static'),
    DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'myapp',
    SESSION_SECRET: process.env.SESSION_SECRET || 'change-this-in-production',
};