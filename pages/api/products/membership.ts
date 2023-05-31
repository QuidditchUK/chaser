import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { Membership } from 'types/membership';
import { EMT } from 'constants/scopes';
import { isScoped_ApiRoute } from 'modules/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Membership[]>
) {
  switch (req.method) {
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const products = await prisma.stripe_products.findMany();
        products.sort(
          (a, b) =>
            new Date(a.expires).getTime() - new Date(b.expires).getTime()
        );
        const results = await Promise.all(
          products.map(async (product) => ({
            product: {
              id: product.uuid,
              name: product.description,
            },
            membershipCount: await prisma.users_stripe_products.count({
              where: { stripe_product_id: product.stripe_product_id },
            }),
          }))
        );

        res.status(200).json(results);

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
