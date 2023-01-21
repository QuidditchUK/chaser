import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { clubs as PrismaClub } from '@prisma/client';

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
    default:
      res.status(404).end();
      return;
  }
}
