import { loadStripe } from '@stripe/stripe-js';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const stripePromise = loadStripe(publicRuntimeConfig.stripeToken);
