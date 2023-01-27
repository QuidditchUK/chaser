import { NextApiRequest, NextApiResponse } from 'next';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, CLUBS_WRITE } from 'constants/scopes';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const club = await prisma.clubs.create({ data: req.body });
        res.status(201).json(club);
      } catch (err) {
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
