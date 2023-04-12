import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';
import sendEmail from 'modules/email';
import sendNotifications from 'modules/sendNotification';
import {
  CLUB_MEMBER_ADDED,
  STUDENT_SUMMER_PASS_PURCHASED,
} from 'constants/notifications';

interface Request extends NextApiRequest {
  body: {
    club_uuid: string;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      try {
        const token = await getToken({ req });

        if (!token || !token?.user) {
          res.status(401).end();
        }

        const { is_student, clubs } = await prisma.users.findUnique({
          where: { uuid: token.user.uuid },
          include: {
            clubs: {
              select: {
                league: true,
              },
            },
          },
        });

        if (!is_student && !(clubs.league === 'Community')) {
          res
            .status(400)
            .json({
              message:
                'Only students playing for university clubs are eligible',
            });
          return;
        }

        const [{ student_summer_pass_expiry }] =
          await prisma.system_settings.findMany({
            select: {
              student_summer_pass_expiry: true,
            },
            orderBy: {
              created: 'desc',
            },
            take: 1,
          });

        const studentSummerPass = await prisma.student_summer_pass.create({
          data: {
            club_uuid: req.body.club_uuid,
            user_uuid: token.user.uuid,
            expires: student_summer_pass_expiry,
          },
        });

        const club = await prisma.clubs.findUnique({
          where: { uuid: req.body.club_uuid },
        });

        // Notifications

        // Send email to club
        await sendEmail({
          template: 'newMember',
          data: {
            first_name: token.user.first_name,
            last_name: token.user.last_name,
            email: token.user.email,
            name: club.name,
          },
          to: club.email,
        });

        // Send notification to club
        if (club.managed_by) {
          await sendNotifications(
            { user_uuid: club.managed_by, type_id: CLUB_MEMBER_ADDED },
            {
              club_name: club.name,
              user_name: `${token.user?.first_name} ${token.user.last_name}`,
            }
          );
        }

        // send notification to user
        await sendNotifications(
          {
            user_uuid: token.user.uuid,
            type_id: STUDENT_SUMMER_PASS_PURCHASED,
          },
          { club_name: club.name }
        );

        res.status(200).end();
        return;
      } catch (error) {
        console.log(error);
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
