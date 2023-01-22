import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, CLUBS_WRITE } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'DELETE':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;
        if (!uuid) {
          res.status(404).json({ error: `No club found with uuid ${uuid}` });
          return;
        }

        const clubTeams = await prisma.teams.findMany({
          where: {
            club_uuid: uuid,
          },
        });

        const team = clubTeams.find(({ uuid }) => uuid === team_uuid);

        if (!team) {
          res
            .status(404)
            .json({
              error: `No team with uuid ${team_uuid} found in club ${uuid}`,
            });
        }

        await prisma.teams.delete({ where: { uuid: team?.uuid } });
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
