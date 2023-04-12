import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { isManager } from 'modules/clubs';
import sendNotifications from 'modules/sendNotification';
import { CLUB_MEMBER_REMOVED } from 'constants/notifications';
import {
  EMT,
  CLUBS_WRITE,
  CLUB_MANAGEMENT as CLUB_MANAGEMENT_SCOPE,
} from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_WRITE]);
        const userIsManager = await isManager(req);
        if (!isScoped && !userIsManager) {
          res.status(401).end();
          return;
        }

        const uuid = req.query.uuid as string;
        const member_uuid = req.query.member_uuid as string;

        // make sure user is member of that club
        const user = await prisma?.users?.findUnique({
          where: {
            uuid: member_uuid,
          },
          include: {
            teams: {
              select: {
                teams: true,
              },
            },
          },
        });

        if (user?.club_uuid !== uuid) {
          res.status(404).json({ error: `No club found with uuid ${uuid}` });
          return;
        }

        const club = await prisma?.clubs?.findUnique({ where: { uuid } });

        // if user is also the manager, remove scope and remove from club as manager
        if (user?.uuid === club?.managed_by) {
          await prisma?.scopes?.deleteMany({
            where: { scope: CLUB_MANAGEMENT_SCOPE, user_uuid: member_uuid },
          });

          await prisma?.clubs?.update({
            where: { uuid },
            data: { managed_by: null },
          });
        }

        // Remove user from club
        await prisma?.users?.update({
          where: { uuid: member_uuid },
          data: {
            club_uuid: null,
            updated: new Date(),
          },
        });

        // Remove user CLUB team if they have one
        const team = user?.teams?.find(({ teams }) => teams?.type === 'CLUB');

        if (team) {
          const teamUsers = await prisma?.teams_users?.findMany({
            where: { team_uuid: team.teams?.uuid },
          });

          // find the relevant teams_users entry
          const teamUser = teamUsers?.find(
            ({ user_uuid: team_user_uuid }) => team_user_uuid === user?.uuid
          );

          // Remove the teams_users row
          if (teamUser) {
            await prisma.teams_users?.delete({
              where: {
                uuid: teamUser?.uuid,
              },
            });
          }
        }

        // notify user they have been removed
        await sendNotifications({
          user_uuid: member_uuid,
          type_id: CLUB_MEMBER_REMOVED,
          data: { club_name: club?.name },
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
