const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));

// Database Connection Test
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL Database'))
    .catch(err => console.error('Database connection error:', err.stack));

// Basic Route
app.get('/', (req, res) => {
    res.send('Nexus Wellness API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
