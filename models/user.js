import pool from '../config/db.js';

export const User = {
    async create({name, password, email}){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                `INSERT INTO users(name, password, email, created_at) VALUES ($1, crypt($2, gen_salt('bf')), $3, CURRENT_TIMESTAMP)
                RETURNING id, name, email, created_at`, [name, password, email]
            );

            await client.query('COMMIT');
            return result.rows[0]
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Database error:', error);
            throw new Error('Error when creating user:' + error.message);
        } finally{
            client.release();
        }
    }
}