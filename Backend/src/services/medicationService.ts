// services/medicationService.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const fetchAvailableMedications = async () => {
  return await prisma.medication.findMany({
    where: {
      stockQuantity: {
        gt: 0,
      },
    },
    orderBy: {
      name: 'asc', 
    },
  });
};