const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrate = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected. Adding streak columns...');

        await client.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS last_login_date DATE;
        `);

        console.log('Done! Columns added successfully.');
        client.release();
    } catch (err) {
        console.error('Migration error:', err.message);
    } finally {
        await pool.end();
    }
};

migrate();
