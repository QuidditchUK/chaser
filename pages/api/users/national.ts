import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';
import sendEmail from 'modules/email';

interface Request extends NextApiRequest {
  body: {
    national_team_interest?: boolean;
    first_team?: string;
    second_team?: string;
    third_team?: string;
    position?: string;
    playstyle?: string;
    years?: number;
    experience?: string;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
          return;
        }

        const { first_name, last_name, club_uuid, email } =
          await prisma.users.findUnique({ where: { uuid: token.user.uuid } });
        await prisma.users.update({
          where: { uuid: token.user.uuid },
          data: req.body,
        });

        let club_name = null;
        if (club_uuid) {
          const club = await prisma.clubs.findUnique({
            where: { uuid: club_uuid },
          });
          club_name = club.name;
        }

        await sendEmail({
          template: 'nationalTeamInterest',
          to: 'quk.scouting@gmail.com',
          data: {
            first_name,
            last_name,
            email,
            club_name,
            first_team: req.body.first_team || '',
            second_team: req.body.second_team || '',
            third_team: req.body.third_team || '',
            position: req.body.position || '',
            playstyle: req.body.playstyle || '',
            years: req.body.years || 0,
            experience: req.body.experience || '',
          },
        });

        res.status(200).end();

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
