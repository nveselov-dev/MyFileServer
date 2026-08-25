const bcrypt = require('bcrypt');

class UserRepository {
    constructor(pool, options = {}) {
        this.pool = pool;
        this.saltRounds = options.saltRounds || 10;
        this.tableName = options.tableName || 'users';
    }

    async create(username, password) {
        const existing = await this.findByUsername(username);
        if (existing) {
            throw new Error('Username already exists');
        }

        const passwordHash = await bcrypt.hash(password, this.saltRounds);

        const result = await this.pool.query(
            `INSERT INTO ${this.tableName} (username, passwordHash)
             VALUES ($1, $2) RETURNING id, username, createdAt`,
            [username, passwordHash]);

        return result.rows[0];
    }

    async findByUsername(username) {
        const result = this.pool.query(
            `SELECT id, username, passwordHash, createdAt
             FROM ${this.tableName}
             WHERE username = $1`,
            [username]
        );

        return result.rows[0] || null;
    }

    async findById(id) {
        const result = await this.pool.query(
            `SELECT id, username, passwordHash, createdAt
             FROM ${this.tableName}
             WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    async validatePassword(plainPassword, passwordHash) {
        return bcrypt.compare(plainPassword, passwordHash);
    }

    async updatePassword(userId, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, this.saltRounds);

        const result = await this.pool.query(
            `UPDATE ${this.tableName}
             SET passwordHash = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 RETURNING id, username`,
            [passwordHash, userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    async delete(userId) {
        const result = await this.pool.query(
            `DELETE
             FROM ${this.tableName}
             WHERE id = $1 RETURNING id`,
            [userId]
        );

        return result.rows.length > 0;
    }

    async findAll(options = {}) {
        const {limit = 100, offset = 0} = options;

        const result = await this.pool.query(
            `SELECT id, username, created_at
             FROM ${this.tableName}
             ORDER BY created_at DESC
                 LIMIT $1
             OFFSET $2`,
            [limit, offset]
        );

        return result.rows;
    }
}

module.exports = UserRepository;