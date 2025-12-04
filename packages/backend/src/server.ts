import { config } from 'dotenv';
config({ quiet: true });
import express from 'express';
import { sendMail } from './mailer.ts';
import { pool } from './models/index.ts';
import bcrypt from 'bcryptjs';


const app = express();

app.use(express.json());


app.get(`/auth/verify`, async (req, res) => {
  // console.log(req.query);
  // res.cookie('authCookie', req.query, {maxAge:900000, httpOnly:true});
  //Need to find hash password end time 
  const 
  const validateToken = await bcrypt.compare(req.query, )
  const tokenExpiryTime = await pool.query(`SELECT token_ended_time FROM token WHERE token_hash = $1`,[req.query]);
  res.send('hello world');
});

app.get(`/users`, async (req, res) => {
  const user = await pool.query(`SELECT * from users`);
  const token = await pool.query(`SELECT * from token`);
  const userTable = user.rows;
  const tokenTable = token.rows;
  res.status(200).json({"user":userTable, "token": tokenTable});
});


app.post('/magic', async (req, res) => {
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


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
