const router = require('express').Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get User Profile
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userProfile = await db.query(
            'SELECT u.full_name, u.email, p.* FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE u.id = $1',
            [req.user.user_id]
        );
        res.json(userProfile.rows[0]);
    } catch (err) {
        console.error("Get profile error:", err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update Profile (Set Goal & Plan)
router.post('/update-plan', authenticateToken, async (req, res) => {
    try {
        const { wellness_goal, plan_duration, current_plan_data } = req.body;
        const userId = req.user.user_id;

        // Check if profile exists
        const checkProfile = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);

        if (checkProfile.rows.length > 0) {
            // Update
            await db.query(
                `UPDATE user_profiles 
                 SET wellness_goal = $1, plan_duration = $2, current_plan_data = $3, updated_at = NOW() 
                 WHERE user_id = $4`,
                [wellness_goal, plan_duration, current_plan_data, userId]
            );
        } else {
            // Insert
            await db.query(
                `INSERT INTO user_profiles (user_id, wellness_goal, plan_duration, current_plan_data) 
                 VALUES ($1, $2, $3, $4)`,
                [userId, wellness_goal, plan_duration, current_plan_data]
            );
        }

        res.json({ message: 'Plan updated successfully' });

    } catch (err) {
        console.error("Update plan error:", err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Delete Plan
router.delete('/delete-plan', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id;
        await db.query(
            `UPDATE user_profiles 
             SET wellness_goal = NULL, plan_duration = NULL, current_plan_data = NULL, updated_at = NOW() 
             WHERE user_id = $1`,
            [userId]
        );
        res.json({ message: 'Plan deleted successfully' });
    } catch (err) {
        console.error("Delete plan error:", err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});


module.exports = router;
