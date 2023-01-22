import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, CLUBS_READ, CLUBS_WRITE } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // TODO: Release Teams to Clubs
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_READ]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }
        const uuid = req.query.uuid as string;

        const teams = await prisma.teams.findMany({
          where: { club_uuid: uuid },
        });

        res.json({ teams });
        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    case 'POST':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }
        const uuid = req.query.uuid as string;
        await prisma.teams.create({
          data: {
            ...req.body,
            club_uuid: uuid,
            type: 'CLUB',
          },
        });

        res.status(201).end();
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
