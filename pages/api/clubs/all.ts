import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, CLUBS_READ } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // return all clubs; admin only
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_READ]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const clubs = await prisma.clubs.findMany({
          orderBy: {
            name: 'asc',
          },
          include: {
            _count: {
              select: {
                users: true,
              },
            },
          },
        });

        res.json(clubs);
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
