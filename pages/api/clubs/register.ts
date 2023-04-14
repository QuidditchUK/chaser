import { NextApiRequest, NextApiResponse } from 'next';
import type { RegisterClubFormData } from 'modules/email';
import sendEmail from 'modules/email';
import prisma from 'modules/prisma';

interface Request extends NextApiRequest {
  body: RegisterClubFormData;
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await prisma.clubs.create({
        data: {
          email: req.body.email.toLowerCase(),
          name: req.body.clubName,
          league: req.body.league,
          active: false,
        },
      });

      await sendEmail({
        template: 'registerClubForm',
        to: 'clubs@quidditchuk.org',
        cc: 'admin@quidditchuk.org',
        data: req.body,
      });

      res.status(200).end();
      return;
    default:
      res.status(404).end();
      return;
  }
}
