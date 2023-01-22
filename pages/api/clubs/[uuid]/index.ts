import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { clubs as PrismaClub } from '@prisma/client';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, CLUBS_WRITE } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ club: PrismaClub }>
) {
  switch (req.method) {
    case 'GET':
      try {
        const uuid = req.query.uuid as string;
        const club = await prisma.clubs.findUnique({
          where: { uuid },
          include: {
            teams: true,
            managedBy: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        });
        if (!club) {
          res.status(404);
          return;
        }

        res.status(200).json({ club });
        return;
      } catch (err) {
        res.status(400).end();
        return;
      }

    case 'PUT':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const uuid = req.query.uuid as string;

        const club = await prisma.clubs.update({
          where: { uuid },
          data: req.body,
        });

        if (!club) {
          res.status(404).end();
          return;
        }

        res.status(200).end();
        return;
      } catch (err) {
        res.status(400).end();
        return;
      }

    case 'DELETE':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const uuid = req.query.uuid as string;

        await prisma.clubs.delete({ where: { uuid } });

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
