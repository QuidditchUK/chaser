-- CreateTable
CREATE TABLE "tournaments" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "start" TIMESTAMPTZ(6),
    "end" TIMESTAMPTZ(6),
    "registrationStart" TIMESTAMPTZ(6),
    "registrationEnd" TIMESTAMPTZ(6) NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tournament_teams" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created" TIMESTAMPTZ(6),
    "tournament_uuid" UUID NOT NULL,
    "team_uuid" UUID NOT NULL,

    CONSTRAINT "tournament_teams_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tournament_team_players" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created" TIMESTAMPTZ(6),
    "updated" TIMESTAMPTZ(6),
    "tournament_team_uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,

    CONSTRAINT "tournament_team_players_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "tournament_team_player_registrations" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created" TIMESTAMPTZ(6),
    "updated" TIMESTAMPTZ(6),
    "tournament_team_player_uuid" UUID NOT NULL,
    "tournament_fee_uuid" UUID NOT NULL,
    "medical_form_filled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tournament_team_player_registrations_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_tournament_uuid_fkey" FOREIGN KEY ("tournament_uuid") REFERENCES "tournaments"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_team_uuid_fkey" FOREIGN KEY ("team_uuid") REFERENCES "teams"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_team_players" ADD CONSTRAINT "tournament_team_players_tournament_team_uuid_fkey" FOREIGN KEY ("tournament_team_uuid") REFERENCES "tournament_teams"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_team_players" ADD CONSTRAINT "tournament_team_players_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_team_player_registrations" ADD CONSTRAINT "tournament_team_player_registrations_tournament_team_playe_fkey" FOREIGN KEY ("tournament_team_player_uuid") REFERENCES "tournament_team_players"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_team_player_registrations" ADD CONSTRAINT "tournament_team_player_registrations_tournament_fee_uuid_fkey" FOREIGN KEY ("tournament_fee_uuid") REFERENCES "users_stripe_products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
