import express from 'express';
import { validateUsersCookie } from '../controllers/cookie.ts';
import { pool } from '../database/index.ts';

const router = express.Router();

router.get('/me', async (req, res) => {
        const cookies = req.cookies;
        if(!cookies.information)  return res.status(401).json({ message: 'Unauthorized' });
        
        const parsed = validateUsersCookie(cookies.information);

        if (!parsed) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const userId = parsed.userId;
        const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        return res.status(200).json({ email: user.user_email, name: user.user_name, id:user.user_id });

    } catch (error:unknown) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
});

router.post('/update-name', async (req,res) => {
    const {newName, email} = req.body;
    if(!newName || !email) return res.status(400).json({message:'User Not Existed!'});
    try {
        await pool.query (`UPDATE users SET user_name = $1 WHERE user_email = $2`,[newName,email]);
        return res.status(200).json({message:'Edit Name Successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Edit Name Fail'})
    }
});

export default router;