import { config } from 'dotenv';
config({ quiet: true });
import express from 'express';
import { pool } from './database/index.ts';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.ts';

const app = express();

app.use(cookieParser());
app.use(express.json());

//delete token once per week

// Auth routes
app.use(`/auth`, auth);

app.get(`/dashboard`, async (req, res) => {
  return res.send('hello');
});


//testing purpose to read db
app.get(`/users`, async (req, res) => {
  const user = await pool.query(`SELECT * from users`);
  const token = await pool.query(`SELECT * from token`);
  const userTable = user.rows;
  const tokenTable = token.rows;
  res.status(200).json({ "user": userTable, "token": tokenTable });
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
