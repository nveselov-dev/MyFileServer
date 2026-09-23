const fs = require('fs').promises;
const path = require('path');
const pool = require('../src/db/db');

async function runMigrations() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations_log (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const migrationsDir = path.join(__dirname, '..', 'migrations');
        const files = await fs.readdir(migrationsDir);
        const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();

        const { rows: appliedMigrations } = await pool.query('SELECT name FROM migrations_log');
        const appliedNames = new Set(appliedMigrations.map(row => row.name));

        for (const file of sqlFiles) {
            if (appliedNames.has(file.name)) {
                continue;
            }
            const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
            await pool.query(sql);
            console.log(`${file} used`);
        }

        console.log('Success');
    } catch (err) {
        console.error('Ошибка миграции:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigrations();