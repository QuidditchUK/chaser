import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';
import sendEmail from 'modules/email';

interface Request extends NextApiRequest {
  body: {
    event: string;
    number: number;
    pronouns: string;
    team: string;
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

        const {
          first_name,
          last_name,
          first_team,
          second_team,
          third_team,
          position,
          playstyle,
          years,
          experience,
          club_uuid,
          email,
        } = await prisma.users.findUnique({ where: { uuid: token.user.uuid } });

        let club_name = null;
        if (club_uuid) {
          const club = await prisma.clubs.findUnique({
            where: { uuid: club_uuid },
          });
          club_name = club.name;
        }

        // Email to head scout, with application and national team profile information.
        sendEmail({
          template: 'scoutingApplication',
          to: 'quk.scouting@gmail.com',
          data: {
            first_name,
            last_name,
            email,
            club_name,
            first_team,
            second_team,
            third_team,
            position,
            playstyle,
            years,
            experience,
            ...req.body,
          },
        });

        // Email to user, to confirm application has been received.
        sendEmail({
          template: 'scoutingResponse',
          to: email,
          data: {
            first_name,
            event: req.body.event,
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
