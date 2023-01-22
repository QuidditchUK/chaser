import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { notifications as PrismaNotifications } from '@prisma/client';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PrismaNotifications[]>
) {
  switch (req.method) {
    case 'GET':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const notifications = await prisma?.notifications?.findMany({
          where: {
            user_uuid: token.user?.uuid,
          },
          include: {
            type: true,
          },
          orderBy: {
            created: 'desc',
          },
        });

        res.status(200).json(notifications);
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
