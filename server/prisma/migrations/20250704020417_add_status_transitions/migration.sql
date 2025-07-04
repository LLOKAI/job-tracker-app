-- CreateTable
CREATE TABLE "JobStatusTransition" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "from" "ApplicationStatus" NOT NULL,
    "to" "ApplicationStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobStatusTransition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobStatusTransition" ADD CONSTRAINT "JobStatusTransition_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
