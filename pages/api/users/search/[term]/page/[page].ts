import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { EMT, USERS_READ } from 'constants/scopes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, USERS_READ]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const page = parseInt(req.query.page as string) || 0;
        const term = req.query.term as string;

        const limit = 10;

        // convert any spaces to an OR operator
        const searchTerm = term.trim().split(' ').join(' | ');

        const users = await prisma.users.findMany({
          skip: page * limit,
          take: limit,
          where: {
            OR: [
              {
                email: {
                  search: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                first_name: {
                  search: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  search: searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          },
          select: {
            first_name: true,
            last_name: true,
            uuid: true,
            email: true,
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
            clubs: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            last_name: 'asc',
          },
        });

        const count = await prisma.users.count({
          where: {
            OR: [
              {
                email: {
                  search: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                first_name: {
                  search: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  search: searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          },
        });

        res.status(200).json({ users, pages: Math.ceil(count / limit) });

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
