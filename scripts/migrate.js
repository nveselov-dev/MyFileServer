const fs = require('fs').promises;
const path = require('path');
const pool = require('../src/db/db');

async function runMigrations() {
    try {
        const migrationsDir = path.join(__dirname, '..', 'migrations');
        const files = await fs.readdir(migrationsDir);
        const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();


        for (const file of sqlFiles) {
            const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
            await pool.query(sql);
            console.log(`${file} used`);
        }

        console.log('Success');
    } catch (err) {
        console.error('Ошибка миграции:', err);
    } finally {
        await pool.end();
    }
}

runMigrations();