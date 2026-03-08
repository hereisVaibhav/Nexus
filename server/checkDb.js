const db = require('./db');

async function checkColumns() {
    try {
        const res = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user_profiles'
        `);
        console.log('Columns in user_profiles:');
        res.rows.forEach(col => {
            console.log(`- ${col.column_name} (${col.data_type})`);
        });
    } catch (err) {
        console.error('Error checking columns:', err.message);
    } finally {
        process.exit();
    }
}

checkColumns();
