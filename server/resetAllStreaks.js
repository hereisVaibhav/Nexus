const db = require('./db');

async function resetAllStreaks() {
    try {
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

        console.log(`Resetting all streaks to 1 and setting date to ${todayStr}...`);

        const result = await db.query(
            `UPDATE users 
             SET login_streak = 1, 
                 last_login_date = $1
             RETURNING id, full_name, email, login_streak, last_login_date`,
            [todayStr]
        );

        console.log(`Successfully reset ${result.rows.length} users.`);
        result.rows.forEach(u => {
            console.log(`- ${u.full_name} (${u.email}): Streak ${u.login_streak} [${u.last_login_date.toISOString().split('T')[0]}]`);
        });

    } catch (err) {
        console.error('Error resetting streaks:', err.message);
    } finally {
        process.exit();
    }
}

resetAllStreaks();
