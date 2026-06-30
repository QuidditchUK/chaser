import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT } from 'constants/scopes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

        const tournament_teams_uuids = tournament.tournament_teams.map((tournament_team) => tournament_team.team_uuid);
        const tournament_teams = await prisma.teams.findMany({ where: { uuid: { in: tournament_teams_uuids } } });

        const active_clubs_uuids = (await prisma.clubs.findMany({ where: { active: true } })).map((club) => club.uuid);
        const active_teams = await prisma.teams.findMany({ where: { club_uuid: { in: active_clubs_uuids } } });

        const possible_teams = active_teams.filter((team) => !tournament_teams_uuids.includes(team.uuid));

        res.status(200).json({ tournament_teams, possible_teams });

        return;
      } catch (err) {
        res.status(400).end();
        return;
      }
    case 'POST':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, ADMIN]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.body.team_uuid;

        const existing_matching_teams = await prisma.tournament_teams.findMany({
          where: { tournament_uuid, team_uuid },
        });
        if (existing_matching_teams.length > 0) {
          res.status(400).end();
          return;
        }

        await prisma.tournament_teams.create({
          data: {
            tournament_uuid,
            team_uuid,
          },
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
