import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // mark a notification as read
    case 'PUT':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const uuid = req.query.uuid as string;

        await prisma?.notifications?.update({
          where: { uuid },
          data: { ...req.body, read_date: new Date() },
        });

        res.status(200).end();
        return;
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    case 'DELETE':
      try {
        const uuid = req.query.uuid as string;

        await prisma.notifications.delete({ where: { uuid } });

        res.status(204).end();
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
