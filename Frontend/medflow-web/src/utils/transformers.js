// src/utils/transformers.js

/**
 * Calculate invoice details from the prescriptions and consultation fees.
 * Maps to your Receptionist 'Generate bill' include rules.
 */
export const calculateInvoiceTotal = (consultationFee = 0, prescriptionMedications = []) => {
  const medicineTotal = prescriptionMedications.reduce((sum, item) => {
    // Looks up unit price and multiplies by quantity/frequency/duration metrics
    const price = parseFloat(item.unit_price || 0);
    const qty = parseInt(item.quantity || 1, 10);
    return sum + (price * qty);
  }, 0);

  return {
    consultationFee,
    medicineTotal,
    totalAmount: consultationFee + medicineTotal
  };
};

/**
 * Transforms the Doctor's prescription state array into the correct 
 * structure needed for the 'Prescription_medications' join table payload.
 */
export const preparePrescriptionPayload = (appointmentId, prescriptionItems) => {
  return {
    appointment_id: appointmentId,
    status: 'pending',
    medications: prescriptionItems.map(item => ({
      medication_id: item.medication_id,
      dosage: item.dosage,          // e.g., "500mg"
      frequency: item.frequency,    // e.g., "Twice daily"
      duration: item.duration,      // e.g., "7 days"
    }))
  };
};