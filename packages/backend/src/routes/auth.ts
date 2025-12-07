import express from 'express';
import { hashCookie, validateHashcookie } from '../controllers/cookie.ts';
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

    if (!req.cookies?.information) {
        const cookieCreatedTime = Date.now();
        const hashedCombined = hashCookie(userId, cookieCreatedTime);

        const cookieInformation = {
            userId: userId,
            cookieCreatedTime: cookieCreatedTime,
            combine: hashedCombined
        }
        res.cookie('information', JSON.stringify(cookieInformation), { maxAge: 360000, httpOnly: true, });
        return res.status(200).redirect(`/dashboard`);
    }

    let parsed;
    try {
        parsed = JSON.parse(req.cookies.information);
    } catch (error: unknown) {
        return res.json({ message: 'Invalid cookie format' });
    }
    const parsedCookieCreatedTime = parsed.cookieCreatedTime;
    const parsedCombined = parsed.combine;
    if (!parsedCookieCreatedTime || !parsedCombined) return res.json({ message: 'Invalid cookie' });

    const hashedCombined = hashCookie(userId, parsedCookieCreatedTime);

    if (!validateHashcookie(parsedCombined,hashedCombined)) return res.json({ message: 'Invalid cookie' });
    return res.status(200).redirect(`/dashboard`);
});


//send email to user with magic link
router.post('/mail', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(404).json({ 'message': 'Please enter email' });

  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [email]);
    if (!userExist) await pool.query(`INSERT INTO users (user_email, user_name) VALUES($1, $2) RETURNING *`, [email, "Anonymous"]);

    await sendMail(email);
    return res.status(200).json({ 'message': "email sent!" });

  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ 'message': 'Internall Server Error' });
  }
});

export default router;