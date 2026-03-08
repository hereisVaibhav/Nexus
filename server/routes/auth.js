const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Route
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, securityQuestion, securityAnswer } = req.body;

        // 1. Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(401).json({ message: 'User already exists' });
        }

        // 2. Hash password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 3. Insert new user
        let newUser;
        if (securityQuestion && securityAnswer) {
            const answerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), saltRound);
            newUser = await db.query(
                'INSERT INTO users (full_name, email, password_hash, security_question, security_answer) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [fullName, email, bcryptPassword, securityQuestion, answerHash]
            );
        } else {
            newUser = await db.query(
                'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
                [fullName, email, bcryptPassword]
            );
        }

        // 4. Initialize streak on signup day
        const today = new Date().toISOString().split('T')[0];
        await db.query(
            'UPDATE users SET login_streak = 1, last_login_date = $1 WHERE id = $2',
            [today, newUser.rows[0].id]
        );

        // 5. Generate Token
        const token = jwt.sign({ user_id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token, user: { id: newUser.rows[0].id, name: newUser.rows[0].full_name, email: newUser.rows[0].email, role: newUser.rows[0].role, subscription: newUser.rows[0].subscription, login_streak: 1 } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login Route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        // 2. Check password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        // 3. Calculate Day Streak
        const userData = user.rows[0];
        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD

        let newStreak = userData.login_streak || 0;
        const lastLoginDate = userData.last_login_date; // DATE from DB usually comes as a Date object or string

        if (lastLoginDate) {
            const lastLoginStr = new Date(lastLoginDate).toLocaleDateString('en-CA');

            if (todayStr === lastLoginStr) {
                // Same day login — keep streak as-is
            } else {
                const todayDate = new Date(todayStr);
                const lastDate = new Date(lastLoginStr);
                const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day — increment
                    newStreak += 1;
                } else {
                    // Missed 1+ days — reset
                    newStreak = 1;
                }
            }
        } else {
            // First ever login
            newStreak = 1;
        }

        // 4. Update streak and last_login_date in DB
        await db.query(
            'UPDATE users SET login_streak = $1, last_login_date = $2 WHERE id = $3',
            [newStreak, todayStr, userData.id]
        );

        // 5. Generate Token
        const token = jwt.sign({ user_id: userData.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
            token,
            user: {
                id: userData.id,
                name: userData.full_name,
                email: userData.email,
                role: userData.role,
                subscription: userData.subscription,
                login_streak: newStreak
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Security Question Route
router.post('/get-security-question', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await db.query('SELECT security_question FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.rows[0].security_question) {
            return res.status(400).json({ message: 'No security question set for this account' });
        }

        res.json({ question: user.rows[0].security_question });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.rows[0].security_answer) {
            return res.status(400).json({ message: 'No security answer set for this account' });
        }

        // Verify answer
        const validAnswer = await bcrypt.compare(answer.toLowerCase().trim(), user.rows[0].security_answer);
        if (!validAnswer) {
            return res.status(401).json({ message: 'Incorrect security answer' });
        }

        // Hash new password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await db.query('UPDATE users SET password_hash = $1 WHERE email = $2', [bcryptPassword, email]);

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
