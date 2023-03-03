import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { getToken } from 'next-auth/jwt';
import sendEmail from 'modules/email';

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

        const [{ transfer_window }] = await prisma.system_settings.findMany({
          select: {
            transfer_window: true,
          },
          orderBy: {
            created: 'desc',
          },
          take: 1,
        });

        if (!transfer_window) {
          res.status(403).json({ error: 'Transfer window is not open' });
          return;
        }

        const {
          club_uuid: prev_club_uuid,
          first_name,
          last_name,
        } = await prisma.users.findUnique({ where: { uuid: token.user.uuid } });
        const { club_uuid: new_club_uuid } = req.body;

        const transfer = await prisma.transfers.create({
          data: {
            prev_club_uuid,
            new_club_uuid,
            user_uuid: token.user.uuid,
          },
          include: {
            newClub: true,
            prevClub: true,
          },
        });

        await sendEmail({
          to: 'clubs@quidditchuk.org',
          template: 'transferRequestForm',
          data: {
            first_name,
            last_name,
            prev_club_name: transfer?.prevClub.name,
            new_club_name: transfer?.newClub?.name,
          },
        });

        res.status(201).end();
        return;
      } catch (error) {
        res.status(400).end();
      }

    default:
      res.status(404).end();
      return;
  }
}
