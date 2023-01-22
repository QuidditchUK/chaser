import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getServerStripe } from 'modules/stripe';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Checkout.Session>
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

        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: req.query.price_id as string,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.BASE_URL}/dashboard/membership/success`,
          cancel_url: `${process.env.BASE_URL}/dashboard/membership/purchase`,
          metadata: {
            user_uuid: token.user.uuid,
          },
        });

        res.status(200).json(session);

        return;
      } catch (err) {
        console.log(err);
        res.status(400).json(err);
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
``;
