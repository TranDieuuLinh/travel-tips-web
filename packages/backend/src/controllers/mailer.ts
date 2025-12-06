import { config } from 'dotenv';
config({ quiet: true });
import nodemailer from 'nodemailer';
import { addTokenDB, generateMagicLink } from '../database/TokenService.ts';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});


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

