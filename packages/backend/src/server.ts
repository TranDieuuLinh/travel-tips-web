import { config } from 'dotenv';
config({ quiet: true });
import express from 'express';
import { sendMail } from './mailer.ts';
import { pool } from './database/index.ts';
import cookieParser from 'cookie-parser';
import { getTokenExpiryByURI, hashCookie, storeCookie } from './database/TokenService.ts';
import { getUserIdByURI } from './database/userService.ts';
const app = express();

app.use(cookieParser());
app.use(express.json());

//delete token once per week

//verify link
app.get(`/auth/verify`, async (req, res) => {

  const MAXTOKENLENGTH = 132
  if (typeof (req.query.token) === 'string' && req.query.token.length <= MAXTOKENLENGTH) {

    const decodedURI = decodeURIComponent(req.query.token);
    const userId = await getUserIdByURI(decodedURI);
    const numberTokenExpiry = await getTokenExpiryByURI(decodedURI);

    if (numberTokenExpiry < Date.now()) return res.status(401).json({ message: 'Link Invalidated!' });

    const existedUserId = JSON.parse(req.cookies.information).userId;
    const existedCookieCreated = JSON.parse(req.cookies.information).cookieCreatedTime;
    const existedHashCookieCreated = JSON.parse(req.cookies.information).hashtokenCreatedTime;
    const existedHashUserId = JSON.parse(req.cookies.information).hashUserId;

    if (existedUserId && existedCookieCreated) {
      const { hashedUserId, hashedtokenCreatedTime } = hashCookie(userId, existedCookieCreated);
      if (hashedUserId === existedHashUserId && existedHashCookieCreated === hashedtokenCreatedTime) return;
      return res.status(401).json({message:'Unauthorized user'});
    }
    else {
      const cookieCreatedTime = Date.now();
      res.cookie('information', storeCookie(userId, cookieCreatedTime), { maxAge: 360000, httpOnly: true });
    }
    return res.redirect(`/dashboard`);
  }
  return res.status(404).json({ message: 'invalid URL' });

});

app.get(`/dashboard`, async (req, res) => {
  return res.send(req.cookies);
});

//send email to user with magic link
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
