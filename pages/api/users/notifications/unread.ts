import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ count: number }>
) {
  switch (req.method) {
    case 'GET':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const count = await prisma.notifications.count({
          where: {
            AND: [{ user_uuid: token.user.uuid }, { read: false }],
          },
        });
        res.status(200).json({ count });

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
