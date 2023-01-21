import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'DELETE':
      try {
        const uuid = req.query.uuid as string;
        await prisma?.push_notifications?.delete({ where: { uuid } });

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
