// src/context/WorkflowContext.jsx
import React, { createContext, useState, useContext, useMemo} from 'react';
import { 
  MOCK_USERS, 
  MOCK_STAFF_PROFILES,
  MOCK_PATIENTS, 
  MOCK_APPOINTMENTS, 
  MOCK_TRIAGES, 
  MOCK_PRESCRIPTIONS, 
  MOCK_PRESCRIPTION_ITEMS,
  MOCK_WORKLOADS
} from '../constants/mockData';

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  // Ingest our normalized relational database tables into state
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [triages, setTriages] = useState(MOCK_TRIAGES);
  const [prescriptions, setPrescriptions] = useState(MOCK_PRESCRIPTIONS);
  const [prescriptionItems, setPrescriptionItems] = useState(MOCK_PRESCRIPTION_ITEMS);
  const [workloads, setWorkloads] = useState(MOCK_WORKLOADS);

  const [currentUserRole, setCurrentUserRole] = useState("DOCTOR"); // Try switching to "NURSE", "RECEPTIONIST", "PHARMACIST"

  const currentUser = useMemo(() => {
    return MOCK_STAFF_PROFILES?.[currentUserRole] || MOCK_STAFF_PROFILES["DOCTOR"];
  }, [currentUserRole]);
  

  // recept check in
  const checkInPatient = (appointmentId) => {
    setAppointments(prev => prev.map(app => 
      app.appointment_id === appointmentId 
        ? { ...app, workflow_step: 'AWAITING_TRIAGE' } 
        : app
    ));
    triggerWorkloadRecalculation();
  };


  // nurse
  const submitNurseTriage = (appointmentId, patientId, vitalsData) => {
    // Generate a fresh triage record matching your Triage typedef
    const newTriage = {
      triage_id: `TRG-${Date.now()}`,
      appointment_id: appointmentId,
      blood_pressure: vitalsData.blood_pressure, // "120/80"
      temperature: parseFloat(vitalsData.temperature), // Celsius
      heart_rate: parseInt(vitalsData.heart_rate), // bpm
      weight: parseFloat(vitalsData.weight), // kg
      urgency_level: parseInt(vitalsData.urgency_level), 
      note: vitalsData.note || '',
      created_at: new Date().toISOString()
    };

    // Inject into triage array
    setTriages(prev => [...prev, newTriage]);

    // Advance the appointment status to Doctor consultation queue
    setAppointments(prev => prev.map(app => 
      app.appointment_id === appointmentId 
        ? { ...app, workflow_step: 'AWAITING_CONSULTATION' } 
        : app
    ));
    triggerWorkloadRecalculation();
  };

  // doctor
  const submitDoctorConsultation = (appointmentId, patientId, doctorId, consultationData) => {
    const newPrescriptionId = `PRC-${Date.now()}`;

    // Create a new master prescription record
    const newPrescription = {
      prescription_id: newPrescriptionId,
      appointment_id: appointmentId,
      patient_id: patientId,
      doctor_id: doctorId,
      diagnosis: consultationData.diagnosis,
      allergies: consultationData.allergies || 'None reported',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Build the structural child array items
    const newItems = consultationData.medications.map((med, index) => ({
      item_id: `ITM-${Date.now()}-${index}`,
      prescription_id: newPrescriptionId,
      medication_name: med.name,
      type: med.type || '',
      instruction: med.instruction,
      quantity: parseInt(med.quantity),
      refills: parseInt(med.refills || 0),
      is_dispensed: false
    }));

    setPrescriptions(prev => [...prev, newPrescription]);
    setPrescriptionItems(prev => [...prev, ...newItems]);

    setAppointments(prev => prev.map(app => 
      app.appointment_id === appointmentId 
        ? { ...app, workflow_step: 'AWAITING_PHARMACY' } 
        : app
    ));
    triggerWorkloadRecalculation();
  };


  // pha
  const togglePrescriptionItemCheck = (itemId) => {
    setPrescriptionItems(prev => prev.map(item => 
      item.item_id === itemId ? { ...item, is_dispensed: !item.is_dispensed } : item
    ));
  };

  const dispenseMedications = (appointmentId, prescriptionId) => {
    
    setPrescriptions(prev => prev.map(p => 
      p.prescription_id === prescriptionId ? { ...p, status: 'dispensed' } : p
    ));

    
    setAppointments(prev => prev.map(app => 
      app.appointment_id === appointmentId 
        ? { ...app, workflow_step: 'AWAITING_CHECKOUT' } 
        : app
    ));
    triggerWorkloadRecalculation();
  };

  // recept-checkout
  const finalizePatientCheckout = (appointmentId) => {
    setAppointments(prev => prev.map(app => 
      app.appointment_id === appointmentId 
        ? { ...app, status: 'completed', workflow_step: 'COMPLETED' } 
        : app
    ));
    triggerWorkloadRecalculation();
  };

  
  // admin dash
  const triggerWorkloadRecalculation = () => {
    setAppointments(currentApps => {
      const waiting = currentApps.filter(a => a.workflow_step === 'WAITING').length;
      const triage = currentApps.filter(a => a.workflow_step === 'AWAITING_TRIAGE').length;
      const consultation = currentApps.filter(a => a.workflow_step === 'AWAITING_CONSULTATION').length;
      const pharmacy = currentApps.filter(a => a.workflow_step === 'AWAITING_PHARMACY').length;

      setWorkloads([
        { department_name: 'Reception Front Desk', load_percentage: Math.min(waiting * 6, 100), status_color: waiting > 10 ? 'bg-rose-600' : 'bg-amber-500' },
        { department_name: 'Triage Nursing Core', load_percentage: Math.min(triage * 20, 100), status_color: triage > 3 ? 'bg-amber-500' : 'bg-emerald-500' },
        { department_name: 'Outpatient Consultation', load_percentage: Math.min(consultation * 33, 100), status_color: consultation > 2 ? 'bg-rose-600' : 'bg-emerald-500' },
        { department_name: 'Pharmacy Dispensary', load_percentage: Math.min(pharmacy * 50, 100), status_color: pharmacy > 1 ? 'bg-amber-500' : 'bg-emerald-500' }
      ]);
      return currentApps;
    });
  };

  return (
    <WorkflowContext.Provider value={{
      users: MOCK_USERS,
      currentUser,          // <--- Expose to layout dashboard screens
      setCurrentUserRole,  
      patients,
      appointments,
      triages,
      prescriptions,
      prescriptionItems,
      workloads,
      checkInPatient,
      submitNurseTriage,
      submitDoctorConsultation,
      togglePrescriptionItemCheck,
      dispenseMedications,
      finalizePatientCheckout
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => useContext(WorkflowContext);