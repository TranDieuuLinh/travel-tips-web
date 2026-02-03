import { config } from 'dotenv';
config({ quiet: true });
import crypto from 'crypto';
import { pool } from './index.ts';
import cron from 'node-cron';


export function generateMagicLink() {
  const token = crypto.randomBytes(32).toString('base64');
  const encodedURL = encodeURIComponent(token);
  const magicLink = `${process.env.APP_URL}/auth/verify?token=${encodedURL}`;

  return { token, magicLink };
}

export async function getTokenExpiryByURI(decodedURI: string) {
  const tokenExpiryTimeDB = await pool.query(`SELECT token_ended_time FROM token WHERE token_id = $1`, [decodedURI]);
  const tokenExpiry = tokenExpiryTimeDB.rows[0].token_ended_time;
  return tokenExpiry;
}

export async function delTokenWeekly() {
  try {
    await pool.query(`DELETE FROM token WHERE token_ended_time < NOW() - INTERVAL '1 week'`);
  } catch (error) {
    console.error('Error deleting token weekly', error);
  }
}

cron.schedule('0 2 * * 2', () => {
  delTokenWeekly().catch(console.error);
});


export async function addTokenDB(mail: string, token: string) {
  try {
    const tokenCreatedTime = Date.now();
    const tokenEndedTime = tokenCreatedTime + (1500 * 60 * 1000);
   
    const userId = await pool.query(`SELECT user_id FROM users WHERE user_email = $1`, [mail]);
    const numberUserId = Number(userId.rows[0].user_id)

    const tokenExisted = await pool.query(`SELECT * FROM token WHERE user_id = $1`, [numberUserId]);
    if (tokenExisted.rows.length > 0) await pool.query(`DELETE FROM token WHERE user_id = $1`, [numberUserId]);
    
    await pool.query(`INSERT INTO token (token_id, token_created_time, token_ended_time,user_id ) VALUES ($1,$2,$3,$4) RETURNING *`, [token, tokenCreatedTime, tokenEndedTime, numberUserId]);
  } catch (error) {
    console.error(error);
  }
}


