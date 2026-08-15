import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'modules/prisma';
import { isScoped_ApiRoute } from 'modules/auth';
import { ADMIN, EMT } from 'constants/scopes';
import { parse } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;
        const user_uuid = req.query.player_uuid as string;

        const tournament_team = await prisma.tournament_teams.findFirst({
          where: { tournament_uuid, team_uuid },
        });

        const tournament_team_player = await prisma.tournament_team_players.findMany({
          where: { tournament_team_uuid: tournament_team.uuid, user_uuid },
          include: {
            user: true,
          },
        });

        const registration = await prisma.tournament_team_player_registrations.findMany({
          where: { tournament_team_player_uuid: tournament_team_player[0].uuid },
        });

        const user_stripe_products = await prisma.users_stripe_products.findMany({
          where: { user_uuid: user_uuid },
          include: {
            tournament_team_player_registrations: true,
            products: true,
          },
        });
        // QQ what to do if nobody registered for a tournament? Then the tournament stripe product will show up here?
        // No it won't, because if nobody registered, then the query above won't find this product as related to this user
        const membership_products = user_stripe_products.filter(
          (user_stripe_product) => user_stripe_product.tournament_team_player_registrations.length === 0
        );

        const is_active = membership_products.some((user_stripe_product) => {
          const now = new Date();
          const membership_expiry = parse(user_stripe_product.products?.expires, 'dd-MM-yyyy', new Date()); // QQQQ check other places with expiry parsing
          return membership_expiry > now;
        });

        res.status(200).json({ registration, is_active, user: tournament_team_player[0]?.user });

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
        const user_uuid = req.query.player_uuid as string;

        const tournament_team = await prisma.tournament_teams.findFirst({
          where: { tournament_uuid, team_uuid },
        });

        const tournament_team_player = await prisma.tournament_team_players.findMany({
          where: { tournament_team_uuid: tournament_team.uuid, user_uuid },
        });

        const registration = await prisma.tournament_team_player_registrations.findMany({
          where: { tournament_team_player_uuid: tournament_team_player[0].uuid },
        });

        const user_stripe_products = await prisma.users_stripe_products.findMany({
          where: { user_uuid: user_uuid },
          include: {
            tournament_team_player_registrations: true,
            products: true,
          },
        });
        // QQ what to do if nobody registered for a tournament? Then the tournament stripe product will show up here?
        // No it won't, because if nobody registered, then the query above won't find this product as related to this user
        const membership_products = user_stripe_products.filter(
          (user_stripe_product) => user_stripe_product.tournament_team_player_registrations.length === 0
        );

        const is_active = membership_products.some((user_stripe_product) => {
          const now = new Date();
          const membership_expiry = parse(user_stripe_product.products?.expires, 'dd-MM-yyyy', new Date()); // QQQQ check other places with expiry parsing
          return membership_expiry > now;
        });

        if (!is_active) {
          res.status(400).json({ message: 'User does not have an active membership' });
          return;
        }

        // QQQQ handle case when for another team
        if (registration?.length > 0) {
          res.status(400).json({ message: `User is already registered for this tournament` });
          return;
        }

        console.log(tournament_team_player[0]);
        const new_registration = await prisma.tournament_team_player_registrations.create({
          data: {
            tournament_team_player_uuid: tournament_team_player[0].uuid as string,
            tournament_fee_uuid: null,
            registered_by_admin: true,
          },
        });

        res.status(200).json({ new_registration, is_active });

        return;
      } catch (err) {
        console.log(err);
        res.status(400).end();
        return;
      }

    case 'DELETE':
      try {
        const isScoped = await isScoped_ApiRoute(req, [EMT, ADMIN]);
        if (!isScoped) {
          res.status(401).end();
          return;
        }

        const tournament_uuid = req.query.uuid as string;
        const team_uuid = req.query.team_uuid as string;
        const user_uuid = req.query.player_uuid as string;

        const tournament_team = await prisma.tournament_teams.findFirst({
          where: { tournament_uuid, team_uuid },
        });

        const tournament_team_player = await prisma.tournament_team_players.findMany({
          where: { tournament_team_uuid: tournament_team.uuid, user_uuid },
        });

        await prisma.tournament_team_player_registrations.deleteMany({
          where: {
            tournament_team_player_uuid: tournament_team_player[0].uuid as string,
          },
        });

        res.status(200).json({ message: 'Registration deleted successfully' });

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
