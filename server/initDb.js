const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createTablesQuery = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    subscription VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    gender VARCHAR(20),
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    wellness_goal VARCHAR(255),
    plan_duration VARCHAR(50),
    current_plan_data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const initDb = async () => {
    try {
        console.log("Connecting to database:", process.env.DATABASE_URL.split('@')[1]); // Log only host/db part for safety
        const client = await pool.connect();
        console.log("Connected successfully.");

        console.log("Creating tables...");
        await client.query(createTablesQuery);
        console.log("Tables created successfully!");

        client.release();
    } catch (err) {
        console.error("Error initializing database:", err.message);
    } finally {
        await pool.end();
    }
};

initDb();
