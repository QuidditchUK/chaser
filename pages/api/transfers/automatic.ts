import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const { club_uuid: prev_club_uuid } = await prisma.users.findUnique({
          where: { uuid: token.user.uuid },
        });
        const { new_club_uuid } = req.body;

        const transfers = await prisma.transfers.findMany({
          where: {
            user_uuid: token.user.uuid,
            status: 'MEMBERSHIP_PENDING',
          },
        });
        await Promise.all(
          transfers.map(async (transfer) => {
            await prisma.transfers.update({
              where: { uuid: transfer.uuid },
              data: {
                status: 'DECLINED',
                updated: new Date(),
                reason: 'New membership purchase attempt detected',
              },
            });
          })
        );

        await prisma.transfers.create({
          data: {
            prev_club_uuid,
            new_club_uuid,
            user_uuid: token.user.uuid,
            status: 'MEMBERSHIP_PENDING',
            reason: 'Membership purchase for a club',
          },
          include: {
            newClub: true,
            prevClub: true,
          },
        });

        res.status(200).end();
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
