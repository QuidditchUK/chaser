import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, TRANSFER_READ } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, TRANSFER_READ]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const page = parseInt(req.query.page as string) || 0;

        const limit = 10;

        const transfers = await prisma.transfers.findMany({
          skip: page * limit,
          take: limit,
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
            prevClub: {
              select: {
                name: true,
              },
            },
            newClub: {
              select: {
                name: true,
              },
            },
            actionedBy: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
          where: {
            NOT: { status: 'PENDING' },
          },
          orderBy: {
            created: 'desc',
          },
        });
        const count = await prisma.transfers.count({
          where: {
            NOT: { status: 'PENDING' },
          },
        });

        res.json({ transfers, pages: Math.ceil(count / limit) });

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
