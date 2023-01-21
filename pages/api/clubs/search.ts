import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { clubs as PrismaClub } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ clubs: PrismaClub[] }>
) {
  switch (req.method) {
    case 'GET':
      try {
        const clubs = await prisma.clubs.findMany({
          where: { active: true },
          orderBy: { name: 'asc' },
        });

        res.status(200).json({ clubs });
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
