export const SOCKET_EVENTS = {

  // RECEPTIONIST FLOW
  PATIENT_REGISTERED: "patient:registered",
  PATIENT_CHECKED_IN: "patient:checked_in",
  APPOINTMENT_CREATED: "appointment:created",
  BILL_GENERATED: "billing:generated",


  // NURSE FLOW
  PATIENT_TRIAGED: "patient:triaged",
  QUEUE_UPDATED: "queue:updated",
  PATIENT_STATUS_UPDATED: "patient:status_updated",


  // DOCTOR FLOW
  CONSULTATION_STARTED: "consultation:started",
  DIAGNOSIS_ADDED: "consultation:diagnosis_added",
  CLINICAL_NOTE_ADDED: "consultation:note_added",
  PRESCRIPTION_CREATED: "prescription:created",


  // PHARMACY FLOW
  MEDICATION_DISPENSED: "prescription:dispensed",


  // ADMIN FLOW
  STAFF_CREATED: "staff:created",
  STAFF_UPDATED: "staff:updated",
  STAFF_DEACTIVATED: "staff:deactivated",
  STAFF_ACTIVATED: "staff:activated",
  SYSTEM_STATS_UPDATED: "admin:stats_updated",


  // CORE WORKFLOW (IMPORTANT PIPELINE EVENT)
  PATIENT_MOVED_STAGE: "patient:moved_stage",


  // NOTIFICATIONS (OPTIONAL GLOBAL USE)
  NOTIFICATION: "notification"
};