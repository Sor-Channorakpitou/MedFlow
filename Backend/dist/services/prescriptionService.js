import * as prescriptionRepo from "../repositories/prescriptionRepository.js";
// Get all pending prescriptions
export const getPendingPrescriptions = async () => {
    return await prescriptionRepo.findPendingPrescriptions();
};
// Get prescription details
export const getPrescriptionById = async (id) => {
    const prescription = await prescriptionRepo.findPrescriptionById(id);
    if (!prescription) {
        const error = new Error("Prescription not found.");
        error.statusCode = 404;
        throw error;
    }
    return prescription;
};
// Dispense prescription
export const dispensePrescription = async (id) => {
    return await prescriptionRepo.executeDispenseTransaction(id);
};
//# sourceMappingURL=prescriptionService.js.map