import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { CLUBS_READ, EMT } from 'constants/scopes';
import { isManager } from 'modules/clubs';

export const safeMemberProps = {
  uuid: true,
  first_name: true,
  last_name: true,
  email: true,
  is_student: true,
  university: true,
  stripe_products: {
    select: {
      products: {
        select: {
          description: true,
          expires: true,
        },
      },
    },
  },
  teams: {
    select: {
      teams: {
        select: {
          name: true,
          club_uuid: true,
        },
      },
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_READ]);
        const userIsManager = await isManager(req);
        if (!isScoped && !userIsManager) {
          res.status(401).end();
          return;
        }

        const uuid = req.query.uuid as string;

        const club = await prisma.clubs.findUnique({
          where: { uuid },
          include: {
            users: {
              select: safeMemberProps,
              orderBy: {
                last_name: 'asc',
              },
            },
            student_summer_pass: {
              where: {
                expires: {
                  gt: new Date(),
                },
              },
              include: {
                user: {
                  select: safeMemberProps,
                },
              },
            },
          },
        });

        if (!club) {
          res.status(404).end();
          return;
        }

        const studentSummerPassMembers = club.student_summer_pass.map(
          ({ user }) => user
        );
        res.json({
          members: club.users,
          studentSummerPassMembers,
        });
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
