const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const addColumnsQuery = `
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS security_question VARCHAR(255),
ADD COLUMN IF NOT EXISTS security_answer VARCHAR(255);
`;

const addSecurityQuestions = async () => {
    try {
        console.log("Connecting to database at:", process.env.DATABASE_URL.split('@')[1]);
        const client = await pool.connect();

        console.log("Adding security columns to users table...");
        await client.query(addColumnsQuery);
        console.log("Columns added successfully!");

        client.release();
    } catch (err) {
        console.error("Error updating database:", err.message);
    } finally {
        await pool.end();
    }
};

addSecurityQuestions();
