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
      subject: 'Your URL',
      html: `<p>Your URL is ${magicLink} <br> Please use this link to access your account!</p>`
    }
  )
};

export async function sendReceipt(userEmail: string, country_name_arr: string[], paymentIntentId: string, paid_date: number)
{
  await transporter.sendMail({
    from: 'no-reply@yourdomain.com',
    to: userEmail,
    subject: 'Payment Receipt',
    text: `Hello,

      Your payment for countries: ${country_name_arr.join(', ')} has been successfully processed.

      Payment ID: ${paymentIntentId}
      Date: ${new Date(paid_date).toLocaleString()}
      Amount: $${country_name_arr.length * 2} AUD

      Thank you for your purchase!
      `,
        });
}
