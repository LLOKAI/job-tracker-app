-- Add reminder tracking fields to job applications.
ALTER TABLE "JobApplication" ADD COLUMN "followUpDate" TIMESTAMP(3);
ALTER TABLE "JobApplication" ADD COLUMN "reminderDone" BOOLEAN NOT NULL DEFAULT false;
