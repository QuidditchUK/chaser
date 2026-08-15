import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getServerStripe } from 'modules/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Stripe.Checkout.Session>) {
  switch (req.method) {
    case 'GET':
      try {
        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;
        const user_uuid = req.query.player_uuid as string;

        const stripe = getServerStripe();

        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price: req.query.price_id as string,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/events/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user_uuid}/registration-success`,
          cancel_url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/events/tournaments/${tournament_uuid}/teams/${team_uuid}/players/${user_uuid}`,
          metadata: {
            tournament_uuid: tournament_uuid,
            team_uuid: team_uuid,
            user_uuid: user_uuid,
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
