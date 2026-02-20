import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT } from 'constants/scopes';

// QQ CRUD Tournaments in the admin dashboard
// Tournaments in some public page

// Add teams to tournament
// API endpoints
// Should be something EMT can do, but also club presidents?
// Registration start and end time? Maybe the same as players for starters

// Remove teams from tournament
// Should be something EMT can do, but also club presidents?
// What if someone already paid us? Block? Warn?

// Player signups
// Individual players can join teams
// Club presidents and EMT can add players to teams
// Does player need to be in a club for a team to play? Probably not, but show warning (and maybe some dashboard warning too?)
// Players still need to register themselves
// Player, club captain or EMT member can un-sign-up a player
// Player can only be signed up for one team per tournament

// Player registration
// Form with some medical stuff
// At the end payment step
// Can only be done by player themselves
// Once paid, we should block a bunch of actions
// No un-sign-up-ing, probably no team removal? Maybe EMT can still do with warning?

// Player transfers
// Can only be done by EMT
// Can only be done if the player paid - otherwise allow them to un-sign-up and sign-up to the right place

// QQ Maybe don't delete a tournament if someone paid us for it?

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, ADMIN]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const tournament = req.body;

        const result = await prisma.tournaments.create({
          data: {
            ...tournament,
          },
        });

        res.status(201).json(result);
        return;
      } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
      }
    default:
      res.status(404).end();
      return;
  }
}
