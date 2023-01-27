import { NextApiRequest, NextApiResponse } from 'next';
import { getServerStripe } from 'modules/stripe';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      const stripe = await getServerStripe();
      const event = req.body;

      switch (event.type) {
        case 'checkout.session.completed': {
          const { customer, metadata, id } = event.data.object;
          const { user_uuid } = metadata;

          const { data } = await stripe.checkout.sessions.listLineItems(id);
          const [item] = data;

          await prisma.users.update({
            where: { uuid: user_uuid },
            data: { stripe_customer_id: customer },
          });

          const stripe_product_id = item.price.product as string;

          // check product is in system
          const product = await prisma.stripe_products.findUnique({
            where: { stripe_product_id },
          });

          if (!product) {
            const newProduct = await stripe.products.retrieve(
              stripe_product_id
            );

            await prisma.stripe_products.create({
              data: {
                stripe_product_id,
                description: item.id,
                expires: newProduct.metadata.expires,
              },
            });
          }

          await prisma.users_stripe_products.create({
            data: {
              user_uuid,
              stripe_product_id,
            },
          });

          res.status(200).end();
          break;
        }
        default:
          res.status(400).end();
      }

    default:
      res.status(404).end();
      return;
  }
}
