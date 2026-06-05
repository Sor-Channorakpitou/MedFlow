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