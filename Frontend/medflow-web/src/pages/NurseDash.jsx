import { useMemo, useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, TimerReset, TriangleAlert, Users, Minus, CircleDot } from "lucide-react";
import { useWorkflow } from "../hooks/useWorkFlow";
import { claimTriagePatient, createTriageRecord, updateTriageRecord } from '../services/triageAPI';
import { SPECIALTIES } from '../constants/specialties';
import MetricCard from "../components/nurse/MetricCard";
import LiveQueue from "../components/nurse/LiveQueue";
import ActiveTriagePanel from "../components/nurse/ActiveTriagePanel";
import StationLogs from "../components/nurse/StationLogs";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";

const URGENCY_META = {
  4: {
    label: "CRITICAL",
    badge: "border-rose-200 text-rose-600 bg-rose-50/40",
    panel: "text-rose-600 border-rose-600",
    icon: AlertTriangle,
  },
  3: {
    label: "HIGH",
    badge: "border-amber-200 text-amber-600 bg-amber-50/40",
    panel: "text-amber-500 border-amber-500",
    icon: TriangleAlert,
  },
  2: {
    label: "MEDIUM",
    badge: "border-blue-200 text-blue-600 bg-blue-50/40",
    panel: "text-blue-600 border-blue-600",
    icon: Minus,
  },
  1: {
    label: "LOW",
    badge: "border-emerald-200 text-emerald-600 bg-emerald-50/40",
    panel: "text-emerald-600 border-emerald-600",
    icon: CircleDot,
  },
};

const REVERSE_URGENCY_MAP = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const URGENCY_MAP = {
  1: "LOW",
  2: "MEDIUM",
  3: "HIGH",
  4: "CRITICAL",
};

function getBpStatus(bpString) {
  if (!bpString || !bpString.includes("/")) return "UNKNOWN";
  const [sys, dia] = bpString.split("/").map(Number);
  if (!Number.isFinite(sys) || !Number.isFinite(dia)) return "UNKNOWN";
  if (sys >= 140 || dia >= 90) return "HYPERTENSIVE";
  if (sys >= 120 || dia >= 80) return "ELEVATED";
  return "NORMAL";
}

function NurseDash() {
  const { triageQueue: rawQueue, loading: isLoadingQueue } = useWorkflow();
  const { toasts, showToast, dismissToast } = useToast();

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState(3);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState([]);
  const [claimedId, setClaimedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileView, setMobileView] = useState("queue"); // 'queue' or 'triage'

  const [bp, setBp] = useState("120/80");
  const [hr, setHr] = useState("80");
  const [temp, setTemp] = useState("37.0");
  const [weight, setWeight] = useState("70");
  const [spo2, setSpo2] = useState("98");

  const currentUser = {
    id: 1,
    name: "Sarah J.",
    role: "Head of Triage",
    initials: "SJ",
  };

  const reactiveQueue = useMemo(() => {
    const safeQueue = Array.isArray(rawQueue) ? rawQueue : [];

    return safeQueue.map((queue) => {
      const patient = queue.patient || queue.Patient || {};
      const triage = queue.triage || queue.Triage || null;
      const appointment = queue.appointment || queue.Appointment || {};
      const birthYear = patient.dateOfBirth
        ? new Date(patient.dateOfBirth).getFullYear()
        : 1990;
      const currentYear = new Date().getFullYear();

      const basePatientData = {
        id: queue.id,
        queueId: queue.id,
        appointmentId: appointment.id,
        patientId: patient.id,
        name: patient.fullName?.toUpperCase() || "UNKNOWN",
        age: currentYear - birthYear,
        gender: patient.gender === "MALE" ? "M" : "F",
        arrival: new Date(queue.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        wait: queue.status,
        stage: queue.stage,
        urgency: REVERSE_URGENCY_MAP[triage?.urgencyLevel] || 2,
        vitals: {
          bpSys: triage?.bloodPressure?.split("/")[0] || "120",
          bpDia: triage?.bloodPressure?.split("/")[1] || "80",
          hr: String(triage?.heartRate ?? "80"),
          temp: String(triage?.temperature ?? "37"),
          weight: String(triage?.weight ?? "70"),
          spo2: String(triage?.spo2 ?? "98"),
        },
        notes: triage?.note || "",
      };

      if (queue.id === selectedId) {
        return {
          ...basePatientData,
          urgency: urgencyLevel,
          vitals: {
            ...basePatientData.vitals,
            bpSys: bp.split("/")[0] || "120",
            bpDia: bp.split("/")[1] || "80",
            hr: String(hr),
            temp: String(temp),
            weight: String(weight),
            spo2: String(spo2),
          },
          notes: notes,
        };
      }

      return basePatientData;
    });
  }, [rawQueue, selectedId, urgencyLevel, bp, hr, temp, weight, spo2, notes]);

  useEffect(() => {
    if (reactiveQueue.length > 0) {
      const idExists = reactiveQueue.some((p) => p.id === selectedId);
      if (!selectedId || !idExists) {
        setSelectedId(reactiveQueue[0].id);
        setUrgencyLevel(reactiveQueue[0].urgency);
      }
    }
  }, [reactiveQueue, selectedId]);

  const selectedPatient = useMemo(
    () =>
      reactiveQueue.find((p) => p.id === selectedId) ||
      reactiveQueue[0] ||
      null,
    [reactiveQueue, selectedId],
  );

  useEffect(() => {
    if (selectedPatient) {
      setUrgencyLevel(selectedPatient.urgency || 1);
      setNotes(selectedPatient.notes || "");
      setBp(
        `${selectedPatient.vitals?.bpSys || "120"}/${selectedPatient.vitals?.bpDia || "80"}`,
      );
      setHr(selectedPatient.vitals?.hr || "80");
      setTemp(selectedPatient.vitals?.temp || "37.0");
      setWeight(selectedPatient.vitals?.weight || "70");
      setSpo2(selectedPatient.vitals?.spo2 || "98");
    } else {
      setUrgencyLevel(3);
      setNotes("");
      setBp("120/80");
      setHr("80");
      setTemp("37.0");
      setWeight("70");
      setSpo2("98");
    }
  }, [selectedPatient]);

  const filteredQueue = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reactiveQueue;
    return reactiveQueue.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q),
    );
  }, [reactiveQueue, search]);

  const criticalCount = useMemo(() => {
    const safeQueue = Array.isArray(rawQueue) ? rawQueue : [];
    return safeQueue.filter((t) => t.urgencyLevel === "CRITICAL").length;
  }, [rawQueue]);

  const activeBpStatus = getBpStatus(bp);

  const handleSelectPatient = (patient) => {
    setSelectedId(patient.id);
    setUrgencyLevel(patient.urgency);
    setNotes(patient.notes);
    setBp(`${patient.vitals.bpSys}/${patient.vitals.bpDia}`);
    setHr(patient.vitals.hr);
    setTemp(patient.vitals.temp);
    setWeight(patient.vitals.weight);
    setSpo2(patient.vitals?.spo2 || "98");
    setSelectedSpecialtyId(null);
    setMobileView("triage");

    console.log("Selected patient:", patient);
  };

  const handleClaimPatient = async (patient) => {
    try {
      await claimTriagePatient(patient.queueId || patient.id);
      setClaimedId(patient.id);
      showToast("Patient claimed successfully. Proceed with triage.", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Error claiming patient.",
        "error"
      );
    }
  };

  const handleMoveToDoctor = async () => {
    if (!selectedPatient) return;

    if (!selectedSpecialtyId) {
      showToast("Please select a target specialty before handing over.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      const parsedHeartRate = hr && !isNaN(hr) ? Number(hr) : null;
      const parsedTemperature = temp && !isNaN(temp) ? Number(temp) : null;
      const parsedWeight = weight && !isNaN(weight) ? Number(weight) : null;
      const parsedSpo2 = spo2 && !isNaN(spo2) ? Number(spo2) : null;

      const flatPayload = {
        appointmentId: selectedPatient.appointmentId,
        bloodPressure: bp || null,
        temperature: parsedTemperature,
        weight: parsedWeight,
        heartRate: parsedHeartRate,
        spo2: parsedSpo2,
        urgencyLevel: URGENCY_MAP[urgencyLevel] || "MEDIUM",
        note: notes || null,
        requiredSpecialtyId: selectedSpecialtyId || null,
      };

      const matchedRawItem = rawQueue.find(
        (q) => q.id === selectedPatient.queueId,
      );
      const isAlreadyTriaged = !!matchedRawItem?.appointment?.triage?.urgencyLevel;

      if (isAlreadyTriaged) {
        await updateTriageRecord(selectedPatient.appointmentId, flatPayload);
      } else {
        try {
          await claimTriagePatient(selectedPatient.queueId);
        } catch (claimErr) {
          if (claimErr.response?.data?.message !== "This patient has already been claimed") {
            throw claimErr;
          }
        }
        await createTriageRecord(flatPayload);
      }

      setLogs((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `${selectedPatient.name} successfully committed and handed over to doctor queue.`,
          tone: "success",
        },
        ...prev,
      ]);

      setSelectedId("");
      setNotes("");
      setMobileView("queue");
      showToast("Case successfully triaged and handed over!", "success");
    } catch (err) {
      console.error("Pipeline breakdown pushing data forward:", err);
      showToast(
        err.response?.data?.message || "Error transmitting updates over triage stream.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-left text-gray-900">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Header
        user={currentUser}
        searchPlaceholder="Search patient name, ID..."
        searchValue={search}
        onSearchChange={setSearch}
        hasNotifications={true}
      />

      <main className="flex-1 flex flex-col gap-4 sm:gap-5 lg:gap-6 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 2xl:px-10 py-4 sm:py-5 lg:py-6">
        {/* Metrics Bar - Responsive Grid */}
        <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 shrink-0">
          <MetricCard
            label="CRITICAL"
            value={String(criticalCount).padStart(2, "0")}
            icon={AlertTriangle}
            iconBgColor="bg-rose-50"
            iconColor="text-rose-600"
          />
          <MetricCard
            label="AVG WAIT"
            value="14m"
            icon={TimerReset}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <MetricCard
            label="IN QUEUE"
            value={String(reactiveQueue.length).padStart(2, "0")}
            icon={Users}
            iconBgColor="bg-gray-100"
            iconColor="text-gray-600"
          />
          <MetricCard
            label="TODAY"
            value={String(rawQueue.length).padStart(2, "0")}
            icon={CheckCircle2}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </section>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex-shrink-0 border-b border-gray-200 bg-white rounded-lg -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setMobileView("queue")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                mobileView === "queue"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Queue ({filteredQueue.length})
            </button>
            <button
              onClick={() => setMobileView("triage")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                mobileView === "triage"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Triage
            </button>
          </div>
        </div>

        {/* Core Workspace - Responsive Layout */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 min-h-0 overflow-hidden">
          {/* Queue Column */}
          <div
            className={`${
              mobileView === "triage" ? "hidden lg:flex" : "flex"
            } lg:col-span-7 flex-col bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm min-h-0 overflow-hidden`}
          >
            {isLoadingQueue ? (
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-3">
                  <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Loading triage queue...
                </p>
              </div>
            ) : (
              <LiveQueue
                queue={filteredQueue}
                selectedId={selectedId}
                onSelectPatient={handleSelectPatient}
                urgencyMeta={URGENCY_META}
                claimedId={claimedId}
                onClaim={handleClaimPatient}
              />
            )}
          </div>

          {/* Triage Panel */}
          <div
            className={`${
              mobileView === "queue" ? "hidden lg:flex" : "flex"
            } lg:col-span-5 flex-col bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm min-h-0 overflow-hidden`}
          >
            {selectedPatient ? (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <ActiveTriagePanel
                  selectedPatient={selectedPatient}
                  urgencyLevel={urgencyLevel}
                  setUrgencyLevel={setUrgencyLevel}
                  vitals={{ bp, hr, temp, weight, spo2 }}
                  setBp={setBp}
                  setHr={setHr}
                  setTemp={setTemp}
                  setWeight={setWeight}
                  setSpo2={setSpo2}
                  bpStatus={activeBpStatus}
                  notes={notes}
                  setNotes={setNotes}
                  onMoveToDoctor={handleMoveToDoctor}
                  isSubmitting={isSubmitting}
                  urgencyMeta={URGENCY_META}
                  specialties={SPECIALTIES}
                  selectedSpecialtyId={selectedSpecialtyId}
                  onSpecialtyChange={setSelectedSpecialtyId}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No patient selected
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Select a patient from the queue to begin triage assessment.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default NurseDash;