import { pool } from './index.ts';

export async function getUserIdByURI(decodedURI: string) {
    const userIdDB = await pool.query(`SELECT user_id FROM token WHERE token_id =$1`, [decodedURI]);
    const userId = userIdDB.rows[0].user_id;
    return userId;
}