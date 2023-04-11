import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, CLUBS_READ } from 'constants/scopes';
import { safeMemberProps } from './[uuid]/members';
import { groupByActive } from 'components/admin/clubs/club-members';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // return all clubs; admin only
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, CLUBS_READ]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const clubs = await prisma.clubs.findMany({
          orderBy: {
            name: 'asc',
          },
          include: {
            users: {
              select: safeMemberProps,
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

        // Prisma _count can't quite handle the complexity here
        // Filters the student summer pass array to just return their users
        // Run through groupByActive along with regular club members to get members with an active QUK membership
        // Concat the two and add up the count

        const clubsWithCount = clubs.map((club) => {
          const studentSummerPassMembers = club.student_summer_pass.map(
            ({ user }) => user
          );

          const { active: studentActiveMembers } = groupByActive(
            studentSummerPassMembers
          );
          const { active: activeMembers } = groupByActive(club.users);

          const activeMemberCount =
            activeMembers.concat(studentActiveMembers).length;
          return { ...club, activeMemberCount };
        });

        res.json(clubsWithCount);
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
