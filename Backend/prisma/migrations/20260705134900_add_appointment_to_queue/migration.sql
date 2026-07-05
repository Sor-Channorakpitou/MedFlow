/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "appointmentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Queue_appointmentId_key" ON "Queue"("appointmentId");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
