import express from 'express';
import { hashCookie, validateUsersCookie } from '../controllers/cookie.ts';
import { getTokenExpiryByURI } from '../database/TokenService.ts';
import { getUserIdByURI } from '../database/UserService.ts';
import { sendMail } from '../controllers/mailer.ts';
import { pool } from '../database/index.ts';

const router = express.Router();

//verify magic link and cookie
router.get('/verify', async (req, res) => {
    const MAXTOKENLENGTH = 132
    if (typeof (req.query.token) !== 'string' || req.query.token.length > MAXTOKENLENGTH) return res.status(404).json({ message: 'invalid URL' });

    const decodedURI = decodeURIComponent(req.query.token);

    const tokenExpiry = await getTokenExpiryByURI(decodedURI);
    if (!tokenExpiry || Number(tokenExpiry) < Date.now()) return res.status(401).json({ message: 'Link Invalidated!' });

    const userId = await getUserIdByURI(decodedURI);
    if (!userId) return res.status(401).json({ message: 'Link Invalidated!' });

    const parsedCookie = validateUsersCookie(req.cookies?.information, userId);

    if (!parsedCookie) {
        const cookieCreatedTime = Date.now();
        const hashedCombined = hashCookie(userId, cookieCreatedTime);

        const cookieInformation = {
            userId: userId,
            cookieCreatedTime: cookieCreatedTime,
            combine: hashedCombined
        }
        res.cookie('information', JSON.stringify(cookieInformation), { maxAge: 36000000, httpOnly: true, sameSite:'lax' });
    }

    return res.status(200).redirect(`${process.env.FRONTEND_URL}/countries`);
});




//send email to user with magic link
router.post('/mail', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(404).json({ 'message': 'Please enter email' });

  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [email]);
    if (userExist.rows.length === 0) await pool.query(`INSERT INTO users (user_email, user_name) VALUES($1, $2) RETURNING *`, [email, "Anonymous"]);
    await sendMail(email);
    return res.status(200).json({ 'message': "email sent!" });
    
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ 'message': 'Internal Server Error' });
  }
});

export default router;