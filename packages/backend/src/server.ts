import { config } from 'dotenv';
config({ quiet: true });
import express from 'express';
import { pool } from './database/index.ts';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.ts';
import login from './routes/login.ts';
import basket from './routes/basket.ts';
import paidcountries from './routes/paidcountries.ts';
import Stripe from 'stripe';
import cors from 'cors';
import { sendReceipt } from './controllers/mailer.ts';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

app.use(cookieParser());

const allowedOrigins = ['http://www.travelknowled.ge', `${process.env.FRONTEND_URL}`];
app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST','UPDATE','DELETE'],
}));


app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  try {
    let event;
    if (!endpointSecret) {
      return res.status(400).send('No webhook secret');
    }
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, (err as Error).message);
        return res.sendStatus(400);
      }
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;
    if (!metadata) return res.status(400).json({ error: 'Missing Json' });

    switch (event.type) {
      case 'checkout.session.completed':
        if (session.payment_status === 'paid') {
          const user_id = metadata.user_id;
          const country_name = JSON.parse(metadata.country_slug!);
          const country_name_arr = (Array.isArray(country_name)) ? country_name : [country_name]
          const paid_date = Date.now();
          const paymentIntentId = session.payment_intent as string;
          console.log(user_id , typeof(user_id));

          const userEmail = JSON.parse(metadata.customer_email!) || '';
          await Promise.all(
            country_name_arr.map(each =>
              pool.query(`INSERT INTO paid_country(user_id, paid_country_slug, paid_country_date, paid_country_payment_intent) VALUES ($1,$2,$3,$4)`, [Number(user_id), each.toLowerCase(), paid_date, paymentIntentId])));
          await pool.query(`DELETE FROM cart WHERE user_id = $1`,[Number(user_id)]);
          await sendReceipt(userEmail,country_name_arr,paymentIntentId,paid_date);
          return res.status(200).json({ message: 'Payment done and saved.' });
        } else {
          return res.status(400).json({ message: 'Payment incompleted' });
        }
      case 'charge.dispute.created':
        const dispute = event.data.object as Stripe.Dispute;
        await pool.query(`UPDATE paid_country SET status = $1 WHERE paid_country_payment_intent = $2`, ['disputed', dispute.payment_intent]);
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.log((error as Error).message);
    return res.sendStatus(400);
  }
});

app.use(express.json());

app.post('/api/refund', async (req, res) => {
  const { payment_intent_id } = req.body;
  try {
    console.log(payment_intent_id);
    await stripe.refunds.create({
      payment_intent: payment_intent_id
    });
    await pool.query(`UPDATE paid_country SET status = $1 WHERE paid_country_payment_intent = $2`, ['refunded', payment_intent_id]);
    return res.status(200).json({ message: 'Refund Successfully' })
  } catch (error) {
    console.error(error);
    return res.status(400);
  }
});


//stripe payment
app.post('/api/create-checkout-session', async (req, res) => {
  const { country_slug, user_id, quantity, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    customer_creation: 'always',

    customer_email: email,
    line_items: [{
      price_data: {
        currency: 'aud',
        product_data: {
          name: `Countries choosen to purchase : ${country_slug.join(", ")}`
        },
        unit_amount: 200
      },
      quantity: quantity,
    }],
    metadata: {
      "user_id": user_id,
      "country_slug": JSON.stringify(country_slug),
      customer_email: JSON.stringify(email)
    },
    mode: 'payment',
    success_url: `${process.env.APP_URL}/api/complete`,
    cancel_url: `${process.env.APP_URL}/api/payment-fail`,
  })
  res.json({sessionurl:session.url})
});



app.get('/api/complete', async (req, res) => {
  res.set('Refresh', `3; url=${process.env.FRONTEND_URL}/purchase`);
  res.send('Checkout has completed. You will be redirected shortly...');
});

app.get('/api/payment-fail', async (req, res) => {
  res.set('Refresh', `3; url=${process.env.FRONTEND_URL}/purchase`);
  res.send('Checkout failed. You will be redirected shortly...');
});

// Auth routes
app.use(`/api/auth`, auth);

//me routes
app.use(`/api/login`,login);

app.use(`/api/basket`,basket);

app.use(`/api/paidcountries`,paidcountries)

app.get(`/api/users`, async (req, res) => {
  const user = await pool.query(`SELECT * from users`);
  const token = await pool.query(`SELECT * from token`);
  const paid = await pool.query(`SELECT * from paid_country`);
  const userTable = user.rows;
  const tokenTable = token.rows;
  const paidTable = paid.rows;
  res.status(200).json({ "user": userTable, "token": tokenTable, "paid": paidTable });
});

//logout user by clearing cookie
app.post('/api/logout',(req,res) => {
  res.clearCookie('information', { httpOnly: true, sameSite: 'lax',path: '/' });
  res.status(200).json({ message: "Logged out" });
});


app.listen(3000, () => {
  console.log('Backend running on port 3000');
});

