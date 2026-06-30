import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT } from 'constants/scopes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;

        const tournament = await prisma.tournaments.findUnique({
          where: { uuid: tournament_uuid },
          include: {
            tournament_teams: {
              include: {
                tournament_team_players: {
                  include: {
                    tournament_team_player_registrations: true, // QQ don't return all medical form info here?
                  },
                },
              },
            },
          },
        });

        const team = await prisma.teams.findUnique({
          where: { uuid: team_uuid },
        });

        res.status(200).json({ tournament, team });

        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    case 'DELETE':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, ADMIN]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;

        // QQ what to do with players?
        // QQ do they need to be re-entered each time?
        // QQ maybe pre-populate them when adding from club settings?
        await prisma.tournament_teams.deleteMany({
          where: { tournament_uuid, team_uuid },
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
