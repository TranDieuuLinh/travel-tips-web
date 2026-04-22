import express from 'express';
import { pool } from '../database/index.ts';
import { authmiddleware } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.get('/cart', authmiddleware, async (req, res) => {
  const userId = req.user!.userId;

  try {

    const cartResult = await pool.query(
      `SELECT cart_slug FROM cart WHERE user_id = $1`,
      [userId]
    );

    return res.status(200).json({ cart: cartResult.rows });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/cart', authmiddleware, async (req, res) => {
    const userId = req.user!.userId;
    const { cart_slug } = req.body;
    if (!cart_slug) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const now = Date.now();
    
      // Note: we keep `cart_country_name` column for backwards compatibility,
      // but the canonical identifier is `cart_slug`.
      await pool.query(
        `INSERT INTO cart (cart_slug, cart_country_name, user_id, cart_edit_time) VALUES ($1, $2, $3, $4)`,
        [cart_slug, cart_slug, userId, now]
      );
      return res.status(200).json({ message: 'Cart saved successfully' });
    } catch (error) {
      console.error('Error saving cart:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

router.delete('/cart', authmiddleware, async (req, res) => {
    const userId = req.user!.userId;
    const { cart_slug } = req.body;
    if (!cart_slug) return res.status(400).json({ message: 'Missing required fields' });
  
    try {
      const deleteResult = await pool.query(`DELETE FROM cart WHERE cart_slug = $1 AND user_id = $2`,[cart_slug, userId]);
      if (deleteResult.rowCount === 0)  return res.status(404).json({ message: 'Cart not found for this user' });
  
      return res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
      console.error('Error deleting cart:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  


export default router;
