import express from 'express';
import { pool } from '../database/index.ts';
import { authmiddleware } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.get('/me', authmiddleware, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        return res.status(200).json({ email: user.user_email, name: user.user_name, id:user.user_id });

    } catch (error:unknown) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}); 

router.patch('/update-name', authmiddleware, async (req,res) => {
    const {newName} = req.body;
    if(!newName) return res.status(400).json({message:'New name is required'});
    const userId = req.user!.userId;    
    
    try {
        await pool.query (`UPDATE users SET user_name = $1 WHERE user_id = $2`,[newName,userId]);
        return res.status(200).json({message:'Name updated successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Failed to update name'})
    }
});

export default router;