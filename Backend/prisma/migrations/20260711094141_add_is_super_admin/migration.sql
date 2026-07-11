/*
  Warnings:

  - You are about to drop the column `invoiceItemId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `fromStage` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `toStage` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `QueueHistory` table. All the data in the column will be lost.
  - Added the required column `toStage` to the `QueueHistory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `action` on the `QueueHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QueueAction" AS ENUM ('START', 'COMPLETE', 'TRANSFER', 'CANCEL', 'SKIP');

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "invoiceItemId";

-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN     "needsFollowUp" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "action",
DROP COLUMN "fromStage",
DROP COLUMN "toStage";

-- AlterTable
ALTER TABLE "QueueHistory" DROP COLUMN "stage",
ADD COLUMN     "fromStage" "Stage",
ADD COLUMN     "toStage" "Stage" NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "QueueAction" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;
