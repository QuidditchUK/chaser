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

          // There really shouldn't be more than one
          // We wipe them in /transfers/auromatic
          // If someone gets here with two, they did some messing around
          // And they can deal with it with a transfer request
          const transfer = await prisma.transfers.findFirst({
            where: {
              user_uuid,
              status: 'MEMBERSHIP_PENDING',
            },
          });

          if (transfer) {
            await prisma.transfers.updateMany({
              where: { user_uuid },
              data: {
                status: 'APPROVED',
                updated: new Date(),
                reason: 'Membership purchase for a club complete',
              },
            });

            // TODO: DRY up from here, as duplicate of `/approve`
            const user = await prisma.users.update({
              where: { uuid: transfer?.user_uuid },
              data: {
                club_uuid: transfer.new_club_uuid,
                updated: new Date(),
              },
              include: {
                teams: {
                  select: {
                    teams: {
                      select: {
                        uuid: true,
                        type: true,
                      },
                    },
                  },
                },
              },
            });

            // Remove user CLUB team if they have one
            const team = user?.teams?.find(
              ({ teams }) => teams?.type === 'CLUB'
            );

            if (team) {
              const teamUsers = await prisma?.teams_users?.findMany({
                where: { team_uuid: team.teams?.uuid },
              });

              // find the relevant teams_users entry
              const teamUser = teamUsers?.find(
                ({ user_uuid }) => user_uuid === user?.uuid
              );

              // Remove the teams_users row
              if (teamUser) {
                await prisma.teams_users?.delete({
                  where: {
                    uuid: teamUser?.uuid,
                  },
                });
              }
            }
          }

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
