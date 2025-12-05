import { config } from 'dotenv';
config({ quiet: true });
import crypto from 'crypto';
import { pool } from './index.ts';

export function generateMagicLink() {
  const token = crypto.randomBytes(32).toString('base64');
  const encodedURL = encodeURIComponent(token);
  const magicLink = `${process.env.APP_URL}/auth/verify?token=${encodedURL}`;

  return { token, magicLink };
}

export async function getTokenExpiryByURI(decodedURI: string) {
  const tokenExpiryTime = await pool.query(`SELECT token_ended_time FROM token WHERE token_id = $1`, [decodedURI]);
  const numberTokenExpiry = Number(tokenExpiryTime.rows[0].token_ended_time);
  return numberTokenExpiry;
}


export async function addTokenDB(mail: string, token: string) {
  try {
    const tokenCreatedTime = Date.now();
    const tokenEndedTime = tokenCreatedTime + (15 * 60 * 1000);
    const userId = await pool.query(`SELECT user_id FROM users WHERE user_email = $1`, [mail]);
    const numberUserId = Number(userId.rows[0].user_id)

    await pool.query(`INSERT INTO token (token_id, token_created_time, token_ended_time,user_id ) VALUES ($1,$2,$3,$4) RETURNING *`, [token, tokenCreatedTime, tokenEndedTime, numberUserId]);
  } catch (error) {
    console.error(error);
  }
}

export function hashCookie(userId: string, cookieCreatedTime: number) {
  const hkey = process.env.HMACKEY as string;

  const hashedUserId = crypto.createHmac('sha512', hkey).update(userId).digest('base64');
  const hashedtokenCreatedTime = crypto.createHmac('sha512', hkey).update(cookieCreatedTime.toString()).digest('base64');
  return {hashedUserId, hashedtokenCreatedTime};
}



export function storeCookie(userId: string, cookieCreatedTime: number) {
  const {hashedUserId, hashedtokenCreatedTime} = hashCookie(userId, cookieCreatedTime);
  const cookieInformation = {
    userId: userId,
    cookieCreatedTime: cookieCreatedTime,
    hashUserId: hashedUserId,
    hashtokenCreatedTime: hashedtokenCreatedTime
  }
  return JSON.stringify(cookieInformation);
}


