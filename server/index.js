const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/admin', require('./routes/admin'));

// Database Connection Test
const db = require('./db');

db.query('SELECT NOW()')
    .then(() => console.log('Connected to PostgreSQL Database'))
    .catch(err => console.error('Database connection error:', err.message));

// Basic Route
app.get('/', (req, res) => {
    res.send('Nexus Wellness API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
