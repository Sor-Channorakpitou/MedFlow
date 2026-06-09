// pages/ReceptionistDash.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import MetricCard from "../components/nurse/MetricCard"; // Reusing your clean base metric design
import AppointmentsTable from "../components/receptionist/AppointmentsTable";
import ReceptionSidePanel from "../components/receptionist/ReceptionSidePanel";
import NewPatientRegistration from "../components/receptionist/NewPatientRegistration";
import PatientCheckout from "../components/receptionist/PatientCheckout";

import { Users, TimerReset, CheckCircle2, ClipboardCheck } from "lucide-react";

const mockAppointments = [
  {
    time: "09:15 AM",
    patientName: "Benjamin Carter",
    patientId: "#MF-9821",
    type: "Cardiology Follow-up",
    doctor: "Dr. Aris Thorne",
    status: "WAITING",
  },
  {
    time: "09:30 AM",
    patientName: "Sarah Jenkins",
    patientId: "#MF-1022",
    type: "General Checkup",
    doctor: "Dr. Emily Vance",
    status: "WAITING",
  },
  {
    time: "10:00 AM",
    patientName: "Marcus Thorne",
    patientId: "#MF-4412",
    type: "Lab Diagnostics",
    doctor: "Dr. Aris Thorne",
    status: "WAITING",
  },
  {
    time: "10:15 AM",
    patientName: "Elena Rodriguez",
    patientId: "#MF-5561",
    type: "Consultation",
    doctor: "Dr. Sarah Smith",
    status: "WAITING",
  },
];

const mockStats = {
  pendingInvoices: 14,
  collectionsToday: "$4,280.00",
  transactions: [
    { name: "David Wilson", type: "Co-pay Payment", amount: "$125.00" },
    { name: "Maria Garcia", type: "Lab Diagnostics", amount: "$450.00" },
  ],
};

export default function ReceptionistDash() {
  const [subView, setSubView] = useState("home"); // States: 'home' | 'register' | 'checkout'
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = {
    name: "Reception Team",
    role: "Front Desk Operations",
    initials: "RD",
  };

  return (
    <div className="flex h-screen  max-w-[1600px] bg-slate-100 text-slate-900 font-sans">
      {/* Global Sidebar layout sync */}

      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Unified Global Dynamic Header */}
        <Header
          user={currentUser}
          searchPlaceholder="Search patients, records..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hasNotifications={true}
        />

        {/* View Routing Conditional Core Block */}
        <main className="flex min-h-0 flex-1 flex-col gap-2 py-1 ">
          {subView === "home" && (
            <>
              {/* Dynamic Analytics Counters Section */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Total Patients Today"
                  value="48"
                  icon={Users}
                  iconBgColor="bg-blue-50"
                  iconColor="text-blue-600"
                />
                <MetricCard
                  label="Waiting Patients"
                  value="12"
                  icon={TimerReset}
                  iconBgColor="bg-amber-50"
                  iconColor="text-amber-600"
                />
                <MetricCard
                  label="Checked-In"
                  value="24"
                  icon={ClipboardCheck}
                  iconBgColor="bg-teal-50"
                  iconColor="text-teal-600"
                />
                <MetricCard
                  label="Completed Visits"
                  value="12"
                  icon={CheckCircle2}
                  iconBgColor="bg-emerald-50"
                  iconColor="text-emerald-600"
                />
              </section>

              {/* Operations Grid Area splits */}
              <section className="flex flex-1 min-h-0 gap-3 items-stretch">
                <AppointmentsTable
                  appointments={mockAppointments}
                  onCheckIn={(p) =>
                    console.log("Checking in patient:", p.patientName)
                  }
                />
                <ReceptionSidePanel setSubView={setSubView} stats={mockStats} />
              </section>
            </>
          )}

          {subView === "register" && (
            <NewPatientRegistration onCancel={() => setSubView("home")} />
          )}

          {subView === "checkout" && <PatientCheckout />}
        </main>
      </div>
    </div>
  );
}
