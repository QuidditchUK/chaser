import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT } from 'constants/scopes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, ADMIN]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;
        const user_uuid = req.query.player_uuid as string;

        const tournament_team = await prisma.tournament_teams.findFirst({
          where: { tournament_uuid, team_uuid },
        });

        const tournament_team_player = await prisma.tournament_team_players.findMany({
          where: { tournament_team_uuid: tournament_team.uuid, user_uuid },
        });

        const registration = await prisma.tournament_team_player_registrations.findMany({
          where: { tournament_team_player_uuid: tournament_team_player[0].uuid },
        });

        const new_registration = await prisma.tournament_team_player_registrations.update({
          where: { uuid: registration[0].uuid },
          data: { medical_form_filled: !registration[0].medical_form_filled },
        });

        res.status(200).json({ new_registration });

        return;
      } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
