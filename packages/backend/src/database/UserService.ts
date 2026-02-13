import { pool } from './index.ts';
import crypto from 'crypto';

export async function getUserIdByURI(decodedURI: string) {
    const hashtoken = crypto.createHash('sha256').update(decodedURI).digest('base64');
    
    const userIdDB = await pool.query(`SELECT user_id FROM token WHERE token_id =$1`, [hashtoken]);
    const userId = userIdDB.rows[0].user_id;
    return userId;
}