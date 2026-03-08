const router = require('express').Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(403).json({ message: "No token, authorization denied" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.query('SELECT role FROM users WHERE id = $1', [decoded.user_id]);

        if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user_id = decoded.user_id;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Get all users (Admin only)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await db.query(`
            SELECT 
                u.id, 
                u.full_name, 
                u.email, 
                u.role, 
                u.subscription,
                u.is_active,
                u.created_at,
                up.wellness_goal,
                up.plan_duration
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            ORDER BY u.created_at DESC
        `);
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get admin stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const totalUsers = await db.query('SELECT COUNT(*) FROM users');
        const activePlans = await db.query('SELECT COUNT(*) FROM user_profiles WHERE current_plan_data IS NOT NULL');

        res.json({
            totalUsers: parseInt(totalUsers.rows[0].count),
            activePlans: parseInt(activePlans.rows[0].count)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update user subscription
router.put('/users/:id/subscription', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { subscription } = req.body;

        if (!['free', 'paid'].includes(subscription)) {
            return res.status(400).json({ message: "Invalid subscription type" });
        }

        const updateStatus = await db.query(
            "UPDATE users SET subscription = $1 WHERE id = $2 RETURNING *",
            [subscription, id]
        );

        if (updateStatus.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updateStatus.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Toggle user status (Admin only)
router.put('/users/:id/status', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const updateStatus = await db.query(
            "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING *",
            [is_active, id]
        );

        if (updateStatus.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updateStatus.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update user role (Admin only)
router.put('/users/:id/role', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const updateStatus = await db.query(
            "UPDATE users SET role = $1 WHERE id = $2 RETURNING *",
            [role, id]
        );

        if (updateStatus.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updateStatus.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete user account (Admin only)
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const deleteStatus = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (deleteStatus.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin Force Reset Password (Admin only)
router.put('/users/:id/reset-password', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        // Check user exists
        const user = await db.query('SELECT id FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hash new password
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, id]);

        res.json({ message: 'Password reset successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

