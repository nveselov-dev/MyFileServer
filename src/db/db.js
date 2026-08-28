const { Pool } = require('pg');
const { DB_PORT, DB_USER, DB_HOST, DB_NAME, DB_PASSWORD } = require('../config/config.js');

const pool = new Pool({
    user : DB_USER,
    password : DB_PASSWORD,
    host : DB_HOST,
    database : DB_NAME,
    port: DB_PORT,
})

pool.on('error', (err) => {
    console.error('Unexpected error', err);
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Failure connect to PostgreSQL:', err.message);
    } else {
        console.log('Success connect to PostgreSQL');
        release();
    }
});

module.exports = pool;