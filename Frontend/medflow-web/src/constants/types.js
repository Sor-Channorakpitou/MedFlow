// src/constants/types.js

/**
 * @typedef {Object} User
 * @property {number|string} user_id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} DOB
 * @property {string} role_id
 * @property {string} created_at
 */

/**
 * @typedef {Object} Patient
 * @property {number|string} patient_id
 * @property {string} full_name
 * @property {string} phone
 * @property {string} DOB
 * @property {'M' | 'F'} gender
 * @property {string} address
 * @property {string} created_at
 */

/**
 * @typedef {Object} Triage
 * @property {number|string} triage_id
 * @property {number|string} appointment_id
 * @property {string} blood_pressure - Format: "120/80"
 * @property {number} temperature - Celsius scale
 * @property {number} heart_rate - Beats per minute (bpm)
 * @property {number} weight - In kilograms (kg)
 * @property {1 | 2 | 3 | 4} urgency_level
 * @property {string} note
 * @property {string} created_at
 */

/**
 * @typedef {Object} Appointment
 * @property {number|string} appointment_id
 * @property {number|string} patient_id
 * @property {number|string} user_id - The staff handling the case
 * @property {string} appointment_date
 * @property {string} reason
 * @property {'pending' | 'completed' | 'cancelled'} status
 * @property {string} created_at
 */ 

/**
 * @typedef {Object} Prescription
 * @property {number|string} prescription_id
 * @property {number|string} appointment_id
 * @property {number|string} patient_id
 * @property {number|string} doctor_id - Refers to the User ID of the ordering doctor
 * @property {string} diagnosis
 * @property {string} allergies - High-alert warning note (e.g., "Penicillin Sensitivity")
 * @property {'pending' | 'dispensed' | 'cancelled'} status
 * @property {string} created_at
 */

/**
 * @typedef {Object} PrescriptionItem
 * @property {number|string} item_id
 * @property {number|string} prescription_id
 * @property {string} medication_name - E.g., "Azithromycin 250mg Tablet"
 * @property {string} type - E.g., "Alternative Prescribed" or blank
 * @property {string} instruction - Full clinical usage guide text
 * @property {number} quantity - Total unit count to distribute
 * @property {number} refills - Number of allowed continuous cycles
 * @property {boolean} is_dispensed - Local toggle indicator for validation checklist
 */

/**
 * @typedef {Object} SystemDiagnostic
 * @property {string} version - E.g., "4.12.0-release.b8273"
 * @property {string} build_date - ISO Timestamp
 * @property {string} kernel_engine - Core engine iteration ID
 * @property {string} architecture - Infrastructure specifications
 * @property {'Production' | 'Staging' | 'Development'} environment
 * @property {string} region - E.g., "US-EAST-1"
 */

/**
 * @typedef {Object} DepartmentWorkload
 * @property {string} department_name - E.g., "Emergency", "Cardiology"
 * @property {number} load_percentage - Integer from 0 to 100 representing capacity
 * @property {string} status_color - Tailwind class variant mapping (e.g., "bg-rose-600")
 */