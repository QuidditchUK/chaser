import { NextApiRequest, NextApiResponse } from 'next';
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

        const transfers = await prisma.transfers.findMany({
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
          },
          where: {
            status: 'PENDING',
          },
        });

        res.status(200).json(transfers);

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
