// controllers/medicationController.ts
import type { Request, Response } from 'express';
import * as medicationService from '../services/medicationService';

export const getAllMedications = async (req: Request, res: Response): Promise<void> => {
  try {
    const medications = await medicationService.fetchAvailableMedications();
    res.status(200).json(medications);
  } catch (error) {
    console.error("Prisma fetch error:", error);
    res.status(500).json({ message: "Failed to retrieve medication inventory." });
  }
};