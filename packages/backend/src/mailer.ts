import { config } from 'dotenv';
config({ quiet: true });
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { pool } from './models/index.ts';

function generateMagicLink() {
  const token = crypto.randomBytes(32).toString('base64');
  const encodedURL = encodeURI(token);
  const magicLink = `${process.env.APP_URL}/auth/verify?token=${encodedURL}`;

  return { token, magicLink };
}



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function addTokenDB(mail: string, token: string) {
  try {
    const tokenCreatedTime = Date.now();
    const tokenEndedTime = tokenCreatedTime + (15 * 60 * 1000);
    const userId = await pool.query(`SELECT user_id FROM users WHERE user_email = $1`, [mail]);
    const numberUserId = Number(userId.rows[0].user_id)

    await pool.query(`INSERT INTO token (token_hash, token_created_time, token_ended_time,user_id ) VALUES ($1,$2,$3,$4) RETURNING *`, [token, tokenCreatedTime, tokenEndedTime, numberUserId]);
  } catch (error) {
    console.error(error);
  }
}

export async function sendMail(mail: string) {
  const { token, magicLink } = generateMagicLink();
  await addTokenDB(mail, token);
  await transporter.sendMail(
    {
      from: 'dieulinh268268@gmail.com',
      to: mail,
      subject: 'Your token',
      html: `<p>Your token is:${token} <br>  your URL is ${magicLink} </p>`
    }
  )
};

