import express from 'express';
import { pool } from '../database/index.ts';
import { authmiddleware } from '../middleware/authmiddleware.ts';

const router = express.Router();

router.get('/paidcountryname', authmiddleware, async (req, res) => {
    const userId = req.user!.userId;
  
    try {
      const result = await pool.query( `SELECT paid_country_slug FROM paid_country WHERE user_id = $1`,[userId]);
  
      if (result.rows.length === 0) {
        return res.status(200).json({ paidcountries: [] });
      }
  
      const countries_arr = result.rows.map((p) => p.paid_country_slug);
      return res.status(200).json({ paidcountries: countries_arr });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  });
  

export default router;