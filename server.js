import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // load .env file

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Stripe payment server is running ✅");
});

// ✅ Payment endpoint
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents, e.g. $10 = 1000

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
  client_secret: paymentIntent.client_secret,
  id: paymentIntent.id,
});

  } catch (error) {
    console.error("❌ Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
