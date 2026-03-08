const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://neondb_owner:npg_qCRfjMP6dYG8@ep-aged-grass-a4768q32-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testSignup() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected');

        const fullName = 'Test User';
        const email = 'test_signup_' + Date.now() + '@example.com';
        const password = 'Password123!';
        const securityQuestion = 'Question';
        const securityAnswer = 'Answer';

        // Same logic as auth.js
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);
        console.log('Hashed pass');

        const answerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), saltRound);
        console.log('Hashed answer');

        const query = 'INSERT INTO users (full_name, email, password_hash, security_question, security_answer) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [fullName, email, bcryptPassword, securityQuestion, answerHash];

        const res = await client.query(query, values);
        console.log('Insert success. ID:', res.rows[0].id);

        const newUser = res.rows[0];
        const today = new Date().toISOString().split('T')[0];
        await client.query(
            'UPDATE users SET login_streak = 1, last_login_date = $1 WHERE id = $2',
            [today, newUser.id]
        );
        console.log('Streak updated');

    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await client.end();
    }
}

testSignup();
