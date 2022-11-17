import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getServerStripe } from 'modules/stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ products?: Stripe.Product[] }>
) {
  switch (req.method) {
    case 'GET':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const stripe = getServerStripe();

        const { data: products } = await stripe.products.list({ active: true });
        const { data: prices } = await stripe.prices.list();

        const results = products
          .map((prod) => {
            const price = prices.find(({ product }) => product === prod.id);
            return { ...prod, price };
          })
          .sort((a, b) => a.price.unit_amount - b.price.unit_amount);

        res.status(200).json({ products: results });

        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
