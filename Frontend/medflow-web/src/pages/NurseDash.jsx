import { useMemo, useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  TimerReset,
  TriangleAlert,
  Users,
  Minus,
  CircleDot,
} from "lucide-react";

import MetricCard from "../components/nurse/MetricCard";
import LiveQueue from "../components/nurse/LiveQueue";
import ActiveTriagePanel from "../components/nurse/ActiveTriagePanel";
import StationLogs from "../components/nurse/StationLogs";
import Header from "../components/Header";

import {
  getLiveQueue,
  createTriageRecord,
  updateTriageRecord,
} from "../services/triageAPI";

// Modified styling mapping directly over to text/border states
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
  const [rawQueue, setRawQueue] = useState([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [selectedId, setSelectedId] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState(3);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchBackendQueue = async () => {
    try {
      setIsLoadingQueue(true);
      const data = await getLiveQueue();
      if (data?.success) {
        setRawQueue(data.queue || []);
        setApiError(null);
      }
      console.log(data);
    } catch (err) {
      setApiError("Failed to sync live triage queue.");
    } finally {
      setIsLoadingQueue(false);
    }
  };

  useEffect(() => {
    fetchBackendQueue();
  }, []);

  const reactiveQueue = useMemo(() => {
    return rawQueue.map((item) => {
      const appointment = item.appointment || item;
      const patient = appointment?.patient;

      const birthYear = patient?.dateOfBirth
        ? new Date(patient.dateOfBirth).getFullYear()
        : 1990;
      const currentYear = new Date().getFullYear();

      return {
        id: appointment?.id || item.appointmentId,
        patientId: appointment?.patientId || null,
        name: patient?.fullName
          ? patient.fullName.toUpperCase()
          : "UNKNOWN PATIENT",
        age: currentYear - birthYear,
        gender: patient?.gender?.toUpperCase() === "MALE" ? "M" : "F",
        arrival: appointment?.createdAt
          ? new Date(appointment.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        wait: "WAITING",
        urgency: REVERSE_URGENCY_MAP[item.urgencyLevel] || 2,
        vitals: {
          bpSys: item.bloodPressure?.split("/")[0] || "120",
          bpDia: item.bloodPressure?.split("/")[1] || "80",
          hr: String(item.heartRate || "80"),
          temp: String(item.temperature || "37.0"),
          weight: String(item.weight || "70"),
          spo2: String(item.spo2 || "98"),
        },
        notes: item.note || "",
      };
    });
  }, [rawQueue]);

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
    return rawQueue.filter((t) => t.urgencyLevel === "CRITICAL").length;
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
  };

  const handleMoveToDoctor = async () => {
    if (!selectedPatient) return;
    setIsSubmitting(true);

    try {
      const parsedHeartRate = hr && !isNaN(hr) ? Number(hr) : null;
      const parsedTemperature = temp && !isNaN(temp) ? Number(temp) : null;
      const parsedWeight = weight && !isNaN(weight) ? Number(weight) : null;
      const parsedSpo2 = spo2 && !isNaN(spo2) ? Number(spo2) : null;

      const flatPayload = {
        appointmentId: Number(selectedPatient.id),
        bloodPressure: bp || null,
        temperature: parsedTemperature,
        weight: parsedWeight,
        heartRate: parsedHeartRate,
        spo2: parsedSpo2,
        urgencyLevel: URGENCY_MAP[urgencyLevel] || "MEDIUM",
        note: notes || null,
      };

      const matchedRawItem = rawQueue.find(
        (t) => t.appointmentId === selectedPatient.id,
      );
      const isAlreadyTriaged = !!matchedRawItem?.urgencyLevel;

      if (isAlreadyTriaged) {
        await updateTriageRecord(Number(selectedPatient.id), flatPayload);
      } else {
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
      await fetchBackendQueue();
      alert("Case successfully triaged and handed over!");
    } catch (err) {
      console.error("Pipeline breakdown pushing data forward:", err);
      alert(
        err.response?.data?.message ||
          "Unique constraint error avoided, check network log.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#f8fafc] text-left text-slate-900 antialiased">
      {/* 1. Header component placeholder updated to match Nurse.png perfectly */}
      <Header
        user={currentUser}
        searchPlaceholder="Search..."
        searchValue={search}
        onSearchChange={setSearch}
        hasNotifications={true}
      />

      <main className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
        
        {/* 2. Metric Cards Layout - Labels configured to align with Nurse.png details */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 shrink-0">
          <MetricCard
            label="CRITICAL PATIENTS"
            value={`0${criticalCount}`}
            icon={AlertTriangle}
            iconBgColor="bg-rose-50"
            iconColor="text-rose-600"
          />
          <MetricCard
            label="AVG. WAIT TIME"
            value="14 min"
            icon={TimerReset}
            iconBgColor="bg-teal-50"
            iconColor="text-teal-600"
          />
          <MetricCard
            label="AWAITING TRIAGE"
            value={String(reactiveQueue.length).padStart(2, "0")}
            icon={Users}
            iconBgColor="bg-slate-100"
            iconColor="text-slate-500"
          />
          <MetricCard
            label="TOTAL MANAGED TODAY"
            value={String(rawQueue.length).padStart(2, "0")}
            icon={CheckCircle2}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
        </section>

        {/* 3. Core Workspace Layout - Side-by-side layout containing queue and details dashboard panels */}
        <section className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-12 overflow-hidden">
          {apiError ? (
            <div className="xl:col-span-7 flex items-center justify-center bg-white rounded-xl border p-6 text-rose-500">
              <TriangleAlert className="mr-2" /> {apiError}
            </div>
          ) : isLoadingQueue ? (
            <div className="xl:col-span-7 flex items-center justify-center bg-white rounded-xl border p-6 text-slate-400 font-medium">
              Processing data sync streams...
            </div>
          ) : (
            <div className="xl:col-span-7 h-full overflow-hidden flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm">
              <LiveQueue
                queue={filteredQueue}
                selectedId={selectedId}
                onSelectPatient={handleSelectPatient}
                urgencyMeta={URGENCY_META}
              />
            </div>
          )}

          {/* RIGHT SIDEBAR: Houses Active Triage Assessment Panel and Station Event Records */}
          <div className="xl:col-span-5 h-full overflow-hidden flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm分 break-words">
            
            {/* Triage Inputs Engine Section */}
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
              />
            </div>
            
        
              <StationLogs logs={logs} />

          </div>
        </section>
      </main>
    </div>
  );
}

export default NurseDash;