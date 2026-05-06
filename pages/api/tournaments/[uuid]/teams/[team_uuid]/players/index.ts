import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT } from 'constants/scopes';
import { safeMemberProps } from 'pages/api/clubs/[uuid]/members';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;
        const tournament_team = await prisma.tournament_teams.findFirst({
          where: { tournament_uuid, team_uuid },
        });

        const team_players = await prisma.tournament_team_players.findMany({
          where: { tournament_team_uuid: tournament_team.uuid },
          include: { user: { select: safeMemberProps } },
        });

        const team = await prisma.teams.findUnique({ where: { uuid: team_uuid } });
        const club = await prisma.clubs.findUnique({
          where: { uuid: team.club_uuid },
          include: {
            users: {
              select: safeMemberProps,
              orderBy: {
                last_name: 'asc',
              },
            },
          },
        });

        const club_users = club.users; // qq active?
        const team_users = team_players.map((player) => player.user);
        const team_user_ids = team_users.map((user) => user.uuid);

        res.status(200).json({
          team_users,
          possible_users: club_users.filter((club_user) => !team_user_ids.includes(club_user.uuid)),
        });

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
        const team_uuid = req.query.team_uuid as string;
        const tournament_team = await prisma.tournament_teams.findFirst({
          where: { tournament_uuid, team_uuid },
        });

        const user_uuid = req.body.user_uuid;

        const existing_matching_users = await prisma.tournament_team_players.findMany({
          where: { tournament_team_uuid: tournament_team.uuid, user_uuid },
        });

        if (existing_matching_users.length > 0) {
          res.status(400).end();
          return;
        }

        await prisma.tournament_team_players.create({
          data: {
            tournament_team_uuid: tournament_team.uuid,
            user_uuid,
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
