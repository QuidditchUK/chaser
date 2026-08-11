-- AlterTable
ALTER TABLE "tournament_team_player_registrations" ADD COLUMN     "registerd_by_admin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "tournament_fee_uuid" DROP NOT NULL;
