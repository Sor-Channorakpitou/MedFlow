import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

import axios from "../services/api";

import { SocketContext } from "./SocketContext"; 


import { getLiveQueue } from '../services/triageAPI'; // Adjust paths as necessary
import { getPendingPrescriptions } from '../services/prescriptionAPI'; // Adjust paths as necessary
import { getAwaitingPatients } from '../services/consultationAPI'; // Adjust paths as necessary

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const socket = useContext(SocketContext);

  const [appointments, setAppointments] = useState([]);
  const [triageQueue, setTriageQueue] = useState([]);
  const [consultationQueue, setConsultationQueue] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  /**
   * Refresh entire hospital workflow
   */
const refreshWorkflow = useCallback(async () => {
  try {
    // 2. Fire your cleanly-abstracted service functions instead of raw strings!
    const [
      appointmentRes,
      triageData,          // Directly returns response.data from your service
      consultationData,    // Directly returns response.data from your service
      prescriptionData,    // Directly returns response.data from your service
      billingRes,
    ] = await Promise.all([
      axios.get("/api/appointments").catch(() => ({ data: [] })), 
      getLiveQueue().catch(() => ({ queue: [] })),                 // 🛠️ Handled with auth & query params!
      getAwaitingPatients().catch(() => ({ queue: [] })),           // 🛠️ Handled!
      getPendingPrescriptions().catch(() => ({ prescriptions: [] })), // 🛠️ Handled!
      axios.get("/api/billings").catch(() => ({ data: [] })),
    ]);

    // 3. Set your state accurately
    // Note: Since your services return response.data directly, handle fallbacks cleanly
    setAppointments(appointmentRes.data || []);
    setTriageQueue(triageData.queue || triageData);
    setConsultationQueue(consultationData.queue || consultationData);
    setPrescriptions(prescriptionData.prescriptions || prescriptionData);
    setInvoices(billingRes.data || []);

  } catch (err) {
    console.error("Workflow synchronization failed:", err);
  } finally {
    setLoading(false);
  }
}, []);
  /**
   * Initial Load
   */
  useEffect(() => {
    refreshWorkflow();
  }, [refreshWorkflow]);

  /**
   * Socket Listener
   */
  useEffect(() => {
    if (!socket) return;

    const handleWorkflowChange = () => {
      console.log(
        "Workflow updated. Refreshing all dashboards..."
      );

      refreshWorkflow();
    };

    socket.on("workflow_changed", handleWorkflowChange);

    return () => {
      socket.off(
        "workflow_changed",
        handleWorkflowChange
      );
    };
  }, [socket, refreshWorkflow]);

  /**
   * Reception
   */
  const createNewAppointment = async (payload) => {
    const response = await axios.post(
      "/api/appointments",
      payload
    );

    return response.data;
  };

  /**
   * Nurse
   */
  const createTriageRecord = async (payload) => {
    const response = await axios.post(
      "/api/triage",
      payload
    );

    return response.data;
  };

  const updateTriageRecord = async (
    appointmentId,
    payload
  ) => {
    const response = await axios.put(
      `/api/triage/${appointmentId}`,
      payload
    );

    return response.data;
  };

  /**
   * Doctor
   */
  const submitDoctorConsultation = async (
    payload
  ) => {
    const response = await axios.post(
      "/api/consultation",
      payload
    );

    return response.data;
  };

  /**
   * Pharmacist
   */
  const dispensePrescription = async (
    prescriptionId
  ) => {
    const response = await axios.put(
      `/api/prescriptions/${prescriptionId}/dispense`
    );

    return response.data;
  };

  /**
   * Billing
   */
  const issueBillPayment = async (
    invoiceId,
    payload = {}
  ) => {
    const response = await axios.patch(
      `/api/billings/${invoiceId}/issue-payment`,
      payload
    );

    return response.data;
  };

  return (
    <WorkflowContext.Provider
      value={{
        loading,

        appointments,
        triageQueue,
        consultationQueue,
        prescriptions,
        invoices,

        refreshWorkflow,

        createNewAppointment,
        createTriageRecord,
        updateTriageRecord,
        submitDoctorConsultation,
        dispensePrescription,
        issueBillPayment,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () =>
  useContext(WorkflowContext);