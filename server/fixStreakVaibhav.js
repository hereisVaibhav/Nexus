const db = require('./db');

async function fixStreak() {
    try {
        const today = new Date().toISOString().split('T')[0];
        // Reset streak to 1 for Vaibhav (email: vaibhavshingode189@gmail.com)
        const result = await db.query(
            `UPDATE users SET login_streak = 1, last_login_date = $1
             WHERE email = 'vaibhavshingode189@gmail.com'
             RETURNING full_name, email, login_streak, last_login_date`,
            [today]
        );
        if (result.rows.length > 0) {
            console.log('✅ Streak fixed for:', result.rows[0]);
        } else {
            console.log('❌ User not found.');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        process.exit();
    }
}

fixStreak();
