import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const strip = new Stripe(process.env.STRIPE_SECRET_KEY);

export default strip;
