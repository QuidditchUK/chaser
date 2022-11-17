import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getServerStripe } from 'modules/stripe';
import prisma from 'modules/prisma';

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

        const rows = await prisma.users_stripe_products.findMany({
          where: { user_uuid: token.user.uuid },
        });

        console.log(rows);

        if (!rows.length) {
          res.status(200).json({ products: [] });
          return;
        }

        const sortedRows = rows.sort(
          (a, b) => b.created.getTime() - a.created.getTime()
        );

        const stripe = getServerStripe();

        const products = await Promise.all(
          sortedRows.map(({ stripe_product_id }) =>
            stripe.products.retrieve(stripe_product_id)
          )
        );
        const { data: prices } = await stripe.prices.list();

        const results = products.map((prod) => {
          const price = prices.find(({ product }) => product === prod.id);
          return { ...prod, price };
        });

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
