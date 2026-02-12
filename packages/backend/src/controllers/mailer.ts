import { config } from 'dotenv';
config({ quiet: true });
import nodemailer from 'nodemailer';
import { addTokenDB, generateMagicLink } from '../database/TokenService.ts';
import { format } from 'date-fns-tz';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  debug: true,
});


export async function sendMail(mail: string) {
  try {
    console.log("📨 Preparing to send email to:", mail);

    const { token, magicLink } = generateMagicLink();
    await addTokenDB(mail, token);

    console.log("🔑 Token generated:", token);

    const info = await transporter.sendMail({
      from: 'dieulinh268268@gmail.com',
      to: mail,
      subject: 'Your URL',
      html: `<p>Your URL is ${magicLink}<br>Please use this link to access your account!</p>`
    });

    console.log("✅ Email sent:", info.messageId);

  } catch (err) {
    console.error("❌ Send mail failed:", err);
    throw err;
  }
}


export async function sendReceipt(userEmail: string, country_name_arr: string[], paymentIntentId: string, paid_date: number)
{
  const dateInTZ = format(new Date(paid_date), "yyyy-MM-dd HH:mm:ss 'GMT'XXX");

  const html = `
<html>
  <body style="
    font-family: Arial, sans-serif; 
    background: linear-gradient(135deg, #fdf6f0, #f0f4ff); 
    padding: 40px;
  ">
    <div style="
      max-width: 600px; 
      margin: auto; 
      background: #ffffff; 
      padding: 30px; 
      border-radius: 12px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    ">
      <h2 style="color: #333; text-align: center;">Payment Receipt</h2>
      <p style="text-align: center; color: #555;">Thank you for your purchase!</p>
      <hr style="border: none; border-top: 1px solid #eee;">
      <p><strong>Countries Purchased:</strong> ${country_name_arr.join(', ')}</p>
      <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
      <p><strong>Date:</strong> ${dateInTZ}</p>
      <p><strong>Amount:</strong> $${country_name_arr.length * 2} AUD</p>
      <hr style="border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #777; text-align: center;">
        This is an automated receipt. Please do not reply to this email.
      </p>
    </div>
  </body>
</html>
`;


  await transporter.sendMail({
    from: 'no-reply@travelknowled.ge',
    to: userEmail,
    subject: 'Payment Receipt',
    html,
  })
}
