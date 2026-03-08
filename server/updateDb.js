const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const updateTableQuery = `
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS plan_duration VARCHAR(50),
ADD COLUMN IF NOT EXISTS current_plan_data JSONB;
`;

const updateDb = async () => {
    try {
        console.log("Connecting to database...");
        const client = await pool.connect();

        console.log("Updating user_profiles table...");
        await client.query(updateTableQuery);
        console.log("Table updated successfully! columns 'plan_duration' and 'current_plan_data' added.");

        client.release();
    } catch (err) {
        console.error("Error updating database:", err.message);
    } finally {
        await pool.end();
    }
};

updateDb();
