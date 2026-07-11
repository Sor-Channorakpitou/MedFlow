import { Send, ArrowUp, Zap, Thermometer, CheckCircle2, ShieldAlert } from "lucide-react";

function VitalInputCard({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  status,
  icon: Icon,
  className = "",
}) {
  const statusBadgeClass = (statusStr) => {
    switch (statusStr) {
      case "HYPERTENSIVE":
        return "text-rose-600 border-rose-200 bg-rose-50/50";
      case "ELEVATED":
        return "text-amber-600 border-amber-200 bg-amber-50/50";
      case "NORMAL":
        return "text-emerald-600 border-emerald-200 bg-emerald-50/50";
      case "TACHYCARDIA":
        return "text-rose-600 border-rose-200 bg-rose-50/50";
      case "FEVER":
        return "text-amber-600 border-amber-200 bg-amber-50/50";
      case "LOW":
        return "text-rose-600 border-rose-200 bg-rose-50/50";
      default:
        return "text-slate-500 border-slate-200 bg-slate-50";
    }
  };

  return (
    <div
      className={`relative border border-slate-200 rounded-xl bg-white p-3 shadow-sm transition-all duration-200 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-slate-400 transition-colors duration-200 focus-within:text-teal-600" />}
      </div>
      <div className="flex items-baseline font-mono">
        <input
          type="text"
          value={value !== undefined && value !== null ? String(value) : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-lg font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-300"
        />
        {suffix && (
          <span className="pb-0.5 text-[10px] text-slate-400 font-semibold whitespace-nowrap ml-1">
            {suffix}
          </span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-2 right-2 rounded-md border px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase ${statusBadgeClass(status)}`}
        >
          {status}
        </span>
      )}
    </div>
  );
}

export default function ActiveTriagePanel({
  selectedPatient,
  urgencyLevel,
  setUrgencyLevel,
  vitals,
  setBp,
  setHr,
  setTemp,
  setWeight,
  setSpo2,
  bpStatus,
  notes,
  setNotes,
  onMoveToDoctor,
  isSubmitting,
  urgencyMeta,
  specialties,           
  selectedSpecialtyId,  
  onSpecialtyChange,
}) {
  console.log("Panel rendered with:", { selectedPatient, vitals });
  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* 1. Header (STAYS FIXED) */}
      <div className="shrink-0 flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">
            Active Clinical Triage
          </h3>
        </div>
        <span className="rounded-md border border-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-slate-500 bg-slate-50">
          {selectedPatient?.id ? `APT-${selectedPatient.id}` : "STATION 01"}
        </span>
      </div>

      {/* 2. Patient Profile Bar (STAYS FIXED - NEVER SCROLLS AWAY) */}
      <div className="shrink-0 border-b border-slate-100 bg-slate-50/70 p-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          {selectedPatient?.name || "No Patient Selected"}
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          {selectedPatient?.gender && <span className="font-bold text-slate-700">{selectedPatient.gender}</span>}
          {selectedPatient?.age && <> • <span className="font-bold text-slate-700">{selectedPatient.age} Yrs</span></>}
          {selectedPatient?.reason && <> • <span className="italic text-slate-600">"{selectedPatient.reason}"</span></>}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left min-h-0 bg-white">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block ml-0.5">
            Assign Urgency Priority Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(urgencyMeta).map((lvl) => {
              const meta = urgencyMeta[lvl];
              const Icon = meta.icon;
              const active = Number(urgencyLevel) === Number(lvl);

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgencyLevel(Number(lvl))}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[10px] font-black uppercase transition-all tracking-wider ${
                    active
                      ? Number(lvl) === 4
                        ? "border-rose-600 bg-white text-rose-600 ring-2 ring-rose-600/10 font-black shadow-sm"
                        : Number(lvl) === 3
                          ? "border-amber-500 bg-white text-amber-500 ring-2 ring-amber-500/10 font-black shadow-sm"
                          : Number(lvl) === 2
                            ? "border-blue-600 bg-white text-blue-600 ring-2 ring-blue-600/10 font-black shadow-sm"
                            : "border-emerald-600 bg-white text-emerald-600 ring-2 ring-emerald-600/10 font-black shadow-sm"
                      : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vitals Form Grid */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-0.5">
            Vitals Verification Input
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <VitalInputCard
              label="BP (mmHg)"
              value={vitals.bp}
              onChange={setBp}
              placeholder="120/80"
              status={bpStatus}
              icon={ArrowUp}
            />
            <VitalInputCard
              label="HR (bpm)"
              value={vitals.hr}
              onChange={setHr}
              placeholder="80"
              status={
                vitals.hr
                  ? Number(vitals.hr) >= 100
                    ? "TACHYCARDIA"
                    : "NORMAL"
                  : null
              }
              icon={Zap}
            />
            <VitalInputCard
              label="Temp (°C)"
              value={vitals.temp}
              onChange={setTemp}
              placeholder="37.0"
              status={
                vitals.temp
                  ? Number(vitals.temp) >= 37.8
                    ? "FEVER"
                    : "NORMAL"
                  : null
              }
              icon={Thermometer}
            />
            <VitalInputCard
              label="SpO2 (%)"
              value={vitals.spo2}
              onChange={setSpo2}
              placeholder="98"
              status={
                vitals.spo2
                  ? Number(vitals.spo2) < 95
                    ? "LOW"
                    : "NORMAL"
                  : null
              }
              icon={CheckCircle2}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block ml-0.5">
            Route To Specialty
          </label>
          <select
            value={selectedSpecialtyId || ''}
            onChange={(e) => onSpecialtyChange(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="">— Any available doctor —</option>
            {specialties.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Observation Field */}
        <div className="flex flex-col space-y-1.5 min-h-[120px]">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-0.5">
            Chief Complaint & Observations
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document presentation notes, allergen alerts, and triage findings..."
            className="w-full flex-1 resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600/5"
          />
        </div>
      </div>

      {/* 4. Action Button Footer (STAYS FIXED) */}
      <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 p-4">
        <button
          type="button"
          onClick={onMoveToDoctor}
          disabled={!selectedPatient || isSubmitting || !selectedSpecialtyId}
          title={!selectedSpecialtyId ? "Select a target specialty first" : ""}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3 text-xs uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          Commit & Handover Case
        </button>
      </div>
    </div>
  );
}