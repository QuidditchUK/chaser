-- AlterTable
ALTER TABLE "system_settings" ADD COLUMN     "student_summer_pass_expiry" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
