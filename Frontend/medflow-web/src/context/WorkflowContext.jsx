import { useState, useEffect, useCallback } from "react";
import axios from "../services/api";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import { WorkflowContext } from "./WorkflowContextCore";

import { getLiveQueue } from "../services/triageAPI";
import { getPendingPrescriptions } from "../services/prescriptionAPI";
import { getAwaitingPatients } from "../services/consultationAPI";

export const WorkflowProvider = ({ children }) => {
  const socket = useSocket();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [triageQueue, setTriageQueue] = useState([]);
  const [consultationQueue, setConsultationQueue] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshWorkflow = useCallback(async () => {
    try {
      const [
        appointmentRes,
        triageData,
        consultationData,
        prescriptionData,
        billingRes,
      ] = await Promise.all([
        axios.get("/api/appointments").catch(() => ({ data: [] })),
        getLiveQueue().catch(() => ({ queue: [] })),
        getAwaitingPatients().catch(() => ({ queue: [] })),
        getPendingPrescriptions().catch(() => ({ prescriptions: [] })),
        axios.get("/api/billings").catch(() => ({ data: [] })),
      ]);

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

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    refreshWorkflow();
  }, [authLoading, isAuthenticated, refreshWorkflow]);

  useEffect(() => {
    if (!socket) return;
    const handleWorkflowChange = () => {
      console.log("Workflow updated. Refreshing all dashboards...");
      refreshWorkflow();
    };

    socket.on("workflow_changed", handleWorkflowChange);
    socket.on("queueUpdated", handleWorkflowChange);
    return () => {
      socket.off("workflow_changed", handleWorkflowChange);
      socket.off("queueUpdated", handleWorkflowChange)
    };
  }, [socket, refreshWorkflow]);

  const createNewAppointment = async (payload) => {
    const response = await axios.post("/appointments", payload);
    return response.data;
  };

  const createTriageRecord = async (payload) => {
    const response = await axios.post("/triage", payload);
    return response.data;
  };

  const updateTriageRecord = async (appointmentId, payload) => {
    const response = await axios.put(`/triage/${appointmentId}`, payload);
    return response.data;
  };

  const submitDoctorConsultation = async (payload) => {
    const response = await axios.post("/consultation", payload);
    await refreshWorkflow();
    return response.data;
  };

  const dispensePrescription = async (prescriptionId) => {
    const response = await axios.put(
      `/prescriptions/${prescriptionId}/dispense`,
    );
    await refreshWorkflow();
    return response.data;
  };

  const issueBillPayment = async (invoiceId, payload = {}) => {
    const response = await axios.patch(
      `/billings/${invoiceId}/issue-payment`,
      payload,
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
