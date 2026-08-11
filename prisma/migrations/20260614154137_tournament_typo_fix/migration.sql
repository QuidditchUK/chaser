/*
  Warnings:

  - You are about to drop the column `registerd_by_admin` on the `tournament_team_player_registrations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tournament_team_player_registrations" DROP COLUMN "registerd_by_admin",
ADD COLUMN     "registered_by_admin" BOOLEAN NOT NULL DEFAULT false;
