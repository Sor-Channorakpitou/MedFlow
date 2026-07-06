// controllers/medicationController.js
import * as medicationService from '../services/medicationService.js';

export const getAllMedications = async (req, res) => {
  try {
    const medications = await medicationService.fetchAvailableMedications();
    res.status(200).json(medications);
  } catch (error) {
    console.error("Prisma fetch error:", error);
    res.status(500).json({ message: "Failed to retrieve medication inventory." });
  }
};