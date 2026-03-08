const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const updateTableQuery = `
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
`;

const updateDb = async () => {
    try {
        console.log("Connecting to database...");
        const client = await pool.connect();

        console.log("Updating users table...");
        await client.query(updateTableQuery);
        console.log("Table updated successfully! column 'role' added.");

        // Optionally set the first user as admin or a specific email
        // console.log("Setting admin role...");
        await client.query("UPDATE users SET role = 'admin' WHERE email = 'test123@gmail.com'");

        client.release();
    } catch (err) {
        console.error("Error updating database:", err.message);
    } finally {
        await pool.end();
    }
};

updateDb();
