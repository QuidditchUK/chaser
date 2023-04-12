/*
  Warnings:

  - The `expires` column on the `student_summer_pass` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "student_summer_pass" DROP COLUMN "expires",
ADD COLUMN     "expires" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
