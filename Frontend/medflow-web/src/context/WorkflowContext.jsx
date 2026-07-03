import { createContext, useState, useEffect, useContext } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';

const WorkflowContext = createContext();

// Establish backend WebSocket link
const socket = io("http://localhost:3000");

export const WorkflowProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [triageQueue, setTriageQueue] = useState([]);
  const [consultationQueue, setConsultationQueue] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Centralized Sync Engine matching your exact backend route registry
  const syncAllQueues = async () => {
    try {
      const [appRes, triageRes, consultRes, prescRes, invoiceRes] = await Promise.all([
        axios.get('/api/appointments'),
        axios.get('/api/triage/queue'),
        axios.get('/api/consultation/queue'),
        axios.get('/api/prescriptions/pending'),
        axios.get('/api/billings') // Fixed: Plural matching app.use('/api/billings')
      ]);

      setAppointments(appRes.data);
      setTriageQueue(triageRes.data);
      setConsultationQueue(consultRes.data);
      setPrescriptions(prescRes.data);
      setInvoices(invoiceRes.data);
    } catch (error) {
      console.error("❌ Real-time queue sync failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncAllQueues();

    // LISTEN FOR INTER-ROLE BROADCASTS
    socket.on("workflow_changed", () => {
      console.log("⚡ Real-time change detected in hospital system. Syncing views...");
      syncAllQueues();
    });

    return () => {
      socket.off("workflow_changed");
    };
  }, []);

  // FRONTEND FLOW HANDLERS (Aligned with your verified router files)
  
  // 1. Receptionist creates an appointment
  const createNewAppointment = async (appointmentData) => {
    await axios.post('/api/appointments', appointmentData);
  };

  // 2. Nurse logs fresh triage vitals
  const createTriageRecord = async (triageData) => {
    await axios.post('/api/triage', triageData);
  };

  // 3. Nurse updates existing triage record
  const updateTriageRecord = async (triageId, updatedFields) => {
    await axios.patch(`/api/triage/${triageId}`, updatedFields);
  };

  // 4. Doctor logs new consultation/diagnosis (creates record + handles prescriptions internally)
  const submitDoctorConsultation = async (consultData) => {
    // Expects: { appointmentId, patientId, diagnosis, notes, prescribeMedications: [...] }
    await axios.post('/api/consultation', consultData);
  };

  // 5. Pharmacist dispenses items
  const dispensePrescription = async (prescriptionId) => {
    await axios.put(`/api/prescriptions/${prescriptionId}/dispense`);
  };

  // 6. Receptionist processes checkout payment
  const issueBillPayment = async (invoiceId) => {
    // Fixed: Plural matching app.use('/api/billings')
    await axios.patch(`/api/billings/${invoiceId}/issue-payment`);
  };

  return (
    <WorkflowContext.Provider value={{
      appointments,
      triageQueue,
      consultationQueue,
      prescriptions,
      invoices,
      loading,
      createNewAppointment,
      createTriageRecord,
      updateTriageRecord,
      submitDoctorConsultation,
      dispensePrescription,
      issueBillPayment
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => useContext(WorkflowContext);