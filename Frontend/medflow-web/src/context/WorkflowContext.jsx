import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import { WorkflowContext } from "./WorkflowContextCore";
import { SOCKET_EVENTS } from "../sockets/socketEvents";
import { getLiveQueue } from "../services/triageAPI";
import { getPendingPrescriptions } from "../services/prescriptionAPI";
import { getAwaitingPatients } from "../services/consultationAPI";
import { getAllQueues } from "../services/queueAPI";

export const WorkflowProvider = ({ children }) => {
  const socket = useSocket();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [triageQueue, setTriageQueue] = useState([]);
  const [consultationQueue, setConsultationQueue] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [billingQueue, setBillingQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Granular refresh helpers ───────────────────────────────────────────────

  const refreshTriageQueue = useCallback(async () => {
    try {
      const data = await getLiveQueue();
      setTriageQueue(data.queue ?? data);
    } catch (err) {
      console.error("[WorkflowContext] refreshTriageQueue failed:", err);
    }
  }, []);

  const refreshConsultationQueue = useCallback(async () => {
    try {
      const data = await getAwaitingPatients();
      setConsultationQueue(data.queue ?? data);
    } catch (err) {
      console.error("[WorkflowContext] refreshConsultationQueue failed:", err);
    }
  }, []);

  const refreshPrescriptions = useCallback(async () => {
    try {
      const data = await getPendingPrescriptions();
      setPrescriptions(data.prescriptions ?? data);
    } catch (err) {
      console.error("[WorkflowContext] refreshPrescriptions failed:", err);
    }
  }, []);

  const refreshBillingQueue = useCallback(async () => {
    try {
      const allQueues = await getAllQueues();
      // allQueues is an array or 404 (treat 404 as empty)
      const queues = Array.isArray(allQueues) ? allQueues : [];
      setBillingQueue(queues.filter((q) => q.stage === "BILLING" && q.status === "WAITING"));
    } catch (err) {
      // 404 = no queues at all
      setBillingQueue([]);
    }
  }, []);

  // Full refresh — used on initial load
  const refreshWorkflow = useCallback(async () => {
    setLoading(true);
    await Promise.allSettled([
      refreshTriageQueue(),
      refreshConsultationQueue(),
      refreshPrescriptions(),
      refreshBillingQueue(),
    ]);
    setLoading(false);
  }, [refreshTriageQueue, refreshConsultationQueue, refreshPrescriptions, refreshBillingQueue]);

  // ─── Initial data fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    refreshWorkflow();
  }, [authLoading, isAuthenticated, refreshWorkflow]);

  // ─── Socket: new patient registered → add to triage queue ──────────────────
  useEffect(() => {
    if (!socket) return;

    const handlePatientRegistered = ({ patient, queue }) => {
      setTriageQueue((prev) => {
        const exists = prev.some((item) => item.id === queue?.id);
        if (exists) return prev;
        return [...prev, { ...queue, patient }];
      });
    };

    socket.on(SOCKET_EVENTS.PATIENT_REGISTERED, handlePatientRegistered);
    return () => socket.off(SOCKET_EVENTS.PATIENT_REGISTERED, handlePatientRegistered);
  }, [socket]);

  // ─── Socket: queue updated (nurse/doctor claimed a patient) ────────────────
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdated = () => {
      refreshTriageQueue();
      refreshConsultationQueue();
    };

    socket.on(SOCKET_EVENTS.QUEUE_UPDATED, handleQueueUpdated);
    return () => socket.off(SOCKET_EVENTS.QUEUE_UPDATED, handleQueueUpdated);
  }, [socket, refreshTriageQueue, refreshConsultationQueue]);

  // ─── Socket: patient moved to next stage ───────────────────────────────────
  // Fired when: triage → DOCTOR, consultation → PHARMACY/BILLING, pharmacy → BILLING
  useEffect(() => {
    if (!socket) return;

    const handlePatientMovedStage = () => {
      // Could move to triage, doctor, billing — refresh everything relevant
      console.log("PATIENT_MOVED_STAGE received — refreshing queues"); 
      refreshTriageQueue();
      refreshConsultationQueue();
      refreshBillingQueue();
    };

    socket.on(SOCKET_EVENTS.PATIENT_MOVED_STAGE, handlePatientMovedStage);
    return () => socket.off(SOCKET_EVENTS.PATIENT_MOVED_STAGE, handlePatientMovedStage);
  }, [socket, refreshTriageQueue, refreshConsultationQueue, refreshBillingQueue]);

  // ─── Socket: prescription dispensed → pharmacy done, patient moves to billing
  useEffect(() => {
    if (!socket) return;

    const handleMedicationDispensed = () => {
      refreshPrescriptions();
      refreshBillingQueue();
    };

    socket.on(SOCKET_EVENTS.MEDICATION_DISPENSED, handleMedicationDispensed);
    return () => socket.off(SOCKET_EVENTS.MEDICATION_DISPENSED, handleMedicationDispensed);
  }, [socket, refreshPrescriptions, refreshBillingQueue]);

  useEffect(() => {
    if (!socket) return;

    const handlePrescriptionCreated = () => {
      refreshPrescriptions();
    };

    socket.on(SOCKET_EVENTS.PRESCRIPTION_CREATED, handlePrescriptionCreated);
    return () => socket.off(SOCKET_EVENTS.PRESCRIPTION_CREATED, handlePrescriptionCreated);
  }, [socket, refreshPrescriptions]);

  // ─── Socket: patient triaged → refresh triage + consultation queues ─────────
  useEffect(() => {
    if (!socket) return;

    const handlePatientTriaged = () => {
      refreshTriageQueue();
      refreshConsultationQueue();
    };

    socket.on(SOCKET_EVENTS.PATIENT_TRIAGED, handlePatientTriaged);
    return () => socket.off(SOCKET_EVENTS.PATIENT_TRIAGED, handlePatientTriaged);
  }, [socket, refreshTriageQueue, refreshConsultationQueue]);

  return (
    <WorkflowContext.Provider
      value={{
        loading,
        triageQueue,
        consultationQueue,
        prescriptions,
        billingQueue,
        refreshWorkflow,
        refreshTriageQueue,
        refreshConsultationQueue,
        refreshPrescriptions,
        refreshBillingQueue,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};
