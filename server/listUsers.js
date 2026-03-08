const db = require('./db');

async function checkUsers() {
    try {
        const result = await db.query(
            `SELECT id, full_name, email, login_streak, last_login_date FROM users ORDER BY created_at DESC`
        );
        console.log('All users:');
        result.rows.forEach(u => console.log(u));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        process.exit();
    }
}

checkUsers();
