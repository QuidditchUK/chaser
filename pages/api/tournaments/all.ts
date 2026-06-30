import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const tournaments = await prisma.tournaments.findMany({
          orderBy: {
            registrationEnd: 'asc',
          },
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

        res.status(200).json(tournaments);

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
