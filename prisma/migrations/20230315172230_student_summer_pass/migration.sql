-- CreateTable
CREATE TABLE "student_summer_pass" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "expires" TEXT NOT NULL,
    "user_uuid" UUID NOT NULL,
    "club_uuid" UUID NOT NULL,

    CONSTRAINT "student_summer_pass_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "student_summer_pass" ADD CONSTRAINT "student_summer_pass_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_summer_pass" ADD CONSTRAINT "student_summer_pass_club_uuid_fkey" FOREIGN KEY ("club_uuid") REFERENCES "clubs"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
