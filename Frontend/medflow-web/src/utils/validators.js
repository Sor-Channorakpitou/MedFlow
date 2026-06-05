// src/utils/validators.js

/**
 * Validates clinical triage data entry bounds (Nurse workflow)
 */
export const validateTriageForm = (vitals) => {
  const errors = {};

  if (!vitals.blood_pressure) {
    errors.blood_pressure = 'Blood pressure reading is required.';
  } else if (!/^\d{2,3}\/\d{2,3}$/.test(vitals.blood_pressure)) {
    errors.blood_pressure = 'Must match format (e.g., 120/80).';
  }

  if (!vitals.temperature) {
    errors.temperature = 'Body temperature is required.';
  } else if (vitals.temperature < 35 || vitals.temperature > 43) {
    errors.temperature = 'Please enter a realistic temperature value (°C).';
  }

  if (!vitals.urgency_level) {
    errors.urgency_level = 'An urgency triage tier must be assigned.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};