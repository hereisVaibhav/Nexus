const db = require('./db');

async function fixSpecificStreaks() {
    try {
        // Fix test user (test123@gmail.com) -> Streak 2, last login today
        const todayStr = new Date().toLocaleDateString('en-CA');

        console.log(`Setting test user to streak 2...`);
        await db.query(
            `UPDATE users 
             SET login_streak = 2, last_login_date = $1
             WHERE email = 'test123@gmail.com'`,
            [todayStr]
        );

        // Fix Vaibhav (vaibhavshingade189@gmail.com) -> Streak 1, last login today
        console.log(`Setting Vaibhav to streak 1...`);
        await db.query(
            `UPDATE users 
             SET login_streak = 1, last_login_date = $1
             WHERE email = 'vaibhavshingade189@gmail.com'`,
            [todayStr]
        );

        const result = await db.query('SELECT full_name, email, login_streak, last_login_date FROM users');
        console.log('\nFinal DB State:');
        result.rows.forEach(u => {
            console.log(`- ${u.full_name} (${u.email}): Streak ${u.login_streak} [${u.last_login_date.toISOString().split('T')[0]}]`);
        });

    } catch (err) {
        console.error('Error fixing streaks:', err.message);
    } finally {
        process.exit();
    }
}

fixSpecificStreaks();
