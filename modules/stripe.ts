import { Stripe, loadStripe } from '@stripe/stripe-js';
import ServerStripe from 'stripe';

let serverStripePromise: ServerStripe | null;
export const getServerStripe = () => {
  if (!serverStripePromise) {
    serverStripePromise = new ServerStripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }
  return serverStripePromise;
};

let stripePromise: Promise<Stripe | null>;
export const getClientStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(`${process.env.STRIPE_TOKEN}`);
  }
  return stripePromise;
};
