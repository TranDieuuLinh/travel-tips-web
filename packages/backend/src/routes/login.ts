import express from 'express';
import { validateUsersCookie } from '../controllers/cookie.ts';
import { pool } from '../database/index.ts';

const router = express.Router();

router.get('/me', async (req, res) => {
        const cookies = req.cookies;
        console.log('Received cookies:', cookies);
        if(!cookies.information)  return res.status(401).json({ message: 'Unauthorized' });
        
        const parsed = validateUsersCookie(cookies.information);
        if (!parsed) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const userId = parsed.userId;
        console.log('Retrieved userId from cookie:', userId);
        const result = await pool.query(`SELECT user_email, user_name FROM users WHERE user_id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User data retrieved:', result.rows[0]);
        const user = result.rows[0];
        console.log('Sending response with user email and name:', { email: user.user_email, name: user.user_name });
        return res.status(200).json({ email: user.user_email, name: user.user_name });

    } catch (error:unknown) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
});

export default router;