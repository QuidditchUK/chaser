import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { isScoped_ApiRoute } from 'modules/auth';
import sendEmail from 'modules/email';
import sendNotifications from 'modules/sendNotification';
import { TRANSFER_APPROVED, CLUB_MEMBER_ADDED } from 'constants/notifications';
import { EMT, TRANSFER_WRITE } from 'constants/scopes';
import prisma from 'modules/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, TRANSFER_WRITE]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const token = await getToken({ req });
        const { uuid: actioned_by } = token.user;

        const uuid = req.query.uuid as string;

        const { reason } = req.body;

        const transfer = await prisma.transfers.update({
          where: { uuid },
          data: {
            status: 'APPROVED',
            actioned_by,
            updated: new Date(),
            reason,
          },
          include: {
            newClub: true,
          },
        });

        const user = await prisma.users.update({
          where: { uuid: transfer?.user_uuid },
          data: {
            club_uuid: transfer.new_club_uuid,
            updated: new Date(),
          },
          include: {
            teams: {
              select: {
                teams: {
                  select: {
                    uuid: true,
                    type: true,
                  },
                },
              },
            },
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
            ({ user_uuid }) => user_uuid === user?.uuid
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

        // Notifications
        sendEmail({
          to: transfer?.newClub?.email,
          template: 'transferClubNewMember',
          data: {
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email,
            name: transfer?.newClub?.name,
          },
          from: 'clubs@quidditchuk.org',
        });

        sendEmail({
          to: user?.email,
          template: 'transferApproved',
          data: {
            first_name: user?.first_name,
            new_club_name: transfer?.newClub?.name,
          },
          from: 'clubs@quidditchuk.org',
        });

        // Send notification to transferring user
        await sendNotifications(
          {
            user_uuid: transfer?.user_uuid,
            type_id: TRANSFER_APPROVED,
          },
          { club_name: transfer?.newClub?.name }
        );

        // send notification to new club manager
        await sendNotifications(
          {
            user_uuid: transfer?.newClub?.managed_by,
            type_id: CLUB_MEMBER_ADDED,
          },
          {
            club_name: transfer?.newClub?.name,
            user_name: `${user?.first_name} ${user?.last_name}`,
          }
        );

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
