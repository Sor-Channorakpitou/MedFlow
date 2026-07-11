import * as prescriptionService from "../services/prescriptionService.js";
// 1. Pending prescriptions
export const getPendingPrescriptions = async (req, res, next) => {
    try {
        const prescriptions = await prescriptionService.getPendingPrescriptions();
        res.status(200).json({
            success: true,
            count: prescriptions.length,
            prescriptions
        });
    }
    catch (error) {
        next(error);
    }
};
// 2. Prescription details
export const getPrescriptionById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const prescription = await prescriptionService.getPrescriptionById(id);
        res.status(200).json({
            success: true,
            prescription
        });
    }
    catch (error) {
        next(error);
    }
};
// 3. Dispense prescription
export const dispensePrescription = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const result = await prescriptionService.dispensePrescription(id);
        res.status(200).json({
            success: true,
            message: "Prescription dispensed successfully.",
            prescription: result
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=prescriptionController.js.map