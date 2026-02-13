import express from 'express';
import { hashCookie, validateUsersCookie } from '../controllers/cookie.ts';
import { getTokenExpiryByURI, oneTimeLink } from '../database/TokenService.ts';
import { getUserIdByURI } from '../database/UserService.ts';
import { sendMail } from '../controllers/mailer.ts';
import { pool } from '../database/index.ts';
import rateLimit from "express-rate-limit";
import validator from "validator";
import xss from "xss";


const router = express.Router();

const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
});

//verify magic link and cookie
router.get('/verify', verifyLimiter, async (req, res) => {
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
        res.cookie('information', JSON.stringify(cookieInformation), { maxAge: 604800, httpOnly: true, sameSite:'lax' ,secure: process.env.SECURECOOKIE === 'production',});
    }
    await oneTimeLink(decodedURI);

    return res.status(200).redirect(`${process.env.FRONTEND_URL}/countries`);
});

//send email to user with magic link
router.post('/mail', mailLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email || typeof(email)!== 'string') return res.status(200).json({ message: "If the email exists, a magic link has been sent" });
  if (email.length > 254 || !validator.isEmail(email)) return res.status(200).json({ message: "If the email exists, a magic link has been sent" });

  const cleanEmail = xss(email.trim());

  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [cleanEmail]);
    if (userExist.rows.length === 0) await pool.query(`INSERT INTO users (user_email, user_name) VALUES($1, $2) RETURNING *`, [cleanEmail, "Anonymous"]);
    await sendMail(cleanEmail);
    return res.status(200).json({ message: "If the email exists, a magic link has been sent" });
    
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ 'message': 'Internal Server Error' });
  }
});

export default router;