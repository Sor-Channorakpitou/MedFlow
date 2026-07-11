
/*
  Warnings:

  - The values [IN_PROGRESS,TRANSFERRED] on the enum `QueueStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `Queue` table. All the data in the column will be lost.
  - Added the required column `action` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toStage` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QueueStatus_new" AS ENUM ('WAITING', 'PROCESSING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Queue" ALTER COLUMN "status" TYPE "QueueStatus_new" USING ("status"::text::"QueueStatus_new");
ALTER TYPE "QueueStatus" RENAME TO "QueueStatus_old";
ALTER TYPE "QueueStatus_new" RENAME TO "QueueStatus";
DROP TYPE "public"."QueueStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_userId_fkey";

-- DropIndex
DROP INDEX "Queue_patientId_key";

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "userId",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "currentUserId" INTEGER,
ADD COLUMN     "fromStage" "Stage",
ADD COLUMN     "requiredSpecialtyId" INTEGER,
ADD COLUMN     "toStage" "Stage" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "specialtyId" INTEGER;

-- CreateTable
CREATE TABLE "Specialty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueHistory" (
    "id" SERIAL NOT NULL,
    "queueId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stage" "Stage" NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueueHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueHistory" ADD CONSTRAINT "QueueHistory_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueHistory" ADD CONSTRAINT "QueueHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_requiredSpecialtyId_fkey" FOREIGN KEY ("requiredSpecialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_currentUserId_fkey" FOREIGN KEY ("currentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
