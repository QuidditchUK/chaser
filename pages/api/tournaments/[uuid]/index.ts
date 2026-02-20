import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const uuid = req.query.uuid as string;

        const tournament = await prisma.tournaments.findUnique({
          where: { uuid },
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

        res.status(200).json(tournament);

        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    case 'PUT':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, ADMIN]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const uuid = req.query.uuid as string;

        const tournament = await prisma.tournaments.findUnique({
          where: { uuid },
        });
        await prisma.tournaments.update({
          where: { uuid },
          data: {
            ...tournament,
            ...req.body,
          },
        });

        res.status(201).end();
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

        const uuid = req.query.uuid as string;

        await prisma.tournaments.delete({ where: { uuid } });
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
