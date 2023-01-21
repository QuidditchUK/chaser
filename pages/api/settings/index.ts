import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { system_settings as PrismaSystemSettings } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ settings: PrismaSystemSettings }>
) {
  switch (req.method) {
    case 'GET':
      try {
        const [settings] = await prisma.system_settings.findMany({
          orderBy: {
            created: 'desc',
          },
          take: 1,
        });

        res.status(200).json({ settings });
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
