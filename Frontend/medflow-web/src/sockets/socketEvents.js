export const SOCKET_EVENTS = {

  // RECEPTIONIST FLOW
  PATIENT_REGISTERED: "patient:registered",
  BILL_GENERATED: "billing:generated",
  NURSE_AVAILABILITY_UPDATED:"nurse:availability_updated",


  // NURSE FLOW
  PATIENT_TRIAGED: "patient:triaged",
  QUEUE_UPDATED: "queue:updated",

  // DOCTOR FLOW
  DIAGNOSIS_ADDED: "consultation:diagnosis_added",
  PRESCRIPTION_CREATED: "prescription:created",


  // PHARMACY FLOW
  MEDICATION_DISPENSED: "prescription:dispensed",

  // CORE WORKFLOW (IMPORTANT PIPELINE EVENT)
  PATIENT_MOVED_STAGE: "patient:moved_stage",

};