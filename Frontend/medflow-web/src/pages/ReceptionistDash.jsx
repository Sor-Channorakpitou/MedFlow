// src/pages/ReceptionistDash.jsx
import React, { useState, useMemo } from 'react';
import AppointmentsTable from '../components/receptionist/AppointmentsTable';
import NewPatientRegistration from '../components/receptionist/NewPatientRegistration';
import PatientCheckout from '../components/receptionist/PatientCheckout';
import ReceptionSidePanel from '../components/receptionist/ReceptionSidePanel';
import Header from '../components/Header';

import { useWorkflow } from '../hooks/useWorkflow';

function ReceptionistDash() {
  const { 
    appointments = [], 
    patients = [], 
    users = [],
    checkInPatient,
    finalizePatientCheckout
  } = useWorkflow();

  const [subView, setSubView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckoutAppId, setSelectedCheckoutAppId] = useState('');

  const currentUser = {
    name: "Dina", // Set matching your environment session profile
    role: "Lead Patient Access Coordinator",
    initials: "DM",
  };

  const activeAppointmentsList = useMemo(() => {
    const getPriorityWeight = (reasonText) => {
      if (!reasonText) return 1;
      const normalized = reasonText.toLowerCase();
      if (normalized.includes('emergency') || normalized.includes('acute') || normalized.includes('pain')) {
        return 2; // High Priority
      }
      return 1; // Standard FCFS
    };

    return appointments
      // FIX: Remove 'AWAITING_TRIAGE' from here so they drop off this list upon check-in!
      .filter(app => app.workflow_step === 'WAITING')
      .map(app => {
        const patient = patients.find(p => p.patient_id === app.patient_id);
        const staff = users.find(u => u.user_id === app.user_id);

        return {
          id: app.appointment_id,
          patientId: app.patient_id,
          patientName: patient ? patient.full_name : "Unknown Patient",
          rawTime: new Date(app.appointment_date),
          time: new Date(app.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: app.reason || "General Consultation",
          doctor: staff ? staff.name : "Assigned Staff",
          status: "Scheduled", // Since they're filtered to 'WAITING', they are all scheduled baselines
          priorityWeight: getPriorityWeight(app.reason)
        };
      })
      // THE QUEUE ENGINE: Highest Priority jumps ahead. If equal, oldest timestamp takes precedence (FCFS)
      .sort((a, b) => {
        if (b.priorityWeight !== a.priorityWeight) {
          return b.priorityWeight - a.priorityWeight;
        }
        return a.rawTime - b.rawTime;
      })
      .filter(apt => apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [appointments, patients, users, searchQuery]);

  const financialMetrics = useMemo(() => {
    const checkoutQueue = appointments.filter(app => app.workflow_step === 'AWAITING_CHECKOUT');
    return {
      pendingInvoices: checkoutQueue.length,
      collectionsToday: `$${(appointments.filter(app => app.workflow_step === 'AWAITING_CHECKOUT').length * 150).toFixed(2)}`,
      transactions: [
        { name: "Sarah Jenkins", type: "Co-pay Card", amount: "150.00" }
      ]
    };
  }, [appointments]);

  const handleCheckInAction = (apt) => {
    if (apt.status === "Checked In") return;
    checkInPatient(apt.id);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      <Header
        user={currentUser}
        searchPlaceholder="Search arriving patient manifests..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex p-6 gap-5 min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Subview Nav Switcher Links */}
          <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
            <button onClick={() => setSubView('list')} className={`pb-1 border-b-2 transition-all ${subView === 'list' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-400'}`}>
              Arrival Manifest
            </button>
            <button onClick={() => setSubView('register')} className={`pb-1 border-b-2 transition-all ${subView === 'register' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-400'}`}>
              New Registration Form
            </button>
            <button onClick={() => setSubView('checkout')} className={`pb-1 border-b-2 transition-all ${subView === 'checkout' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-400'}`}>
              Billing Cashier Ledger
            </button>
          </div>

          <div className="flex-1 flex min-h-0">
            {subView === 'list' && (
              <AppointmentsTable appointments={activeAppointmentsList} onCheckIn={handleCheckInAction} />
            )}
            {subView === 'register' && (
              <NewPatientRegistration onCompleteRegistration={() => setSubView('list')} />
            )}
            {subView === 'checkout' && (
              <PatientCheckout selectedAppId={selectedCheckoutAppId} onSelectAppId={setSelectedCheckoutAppId} onFinalizeCheckout={finalizePatientCheckout} />
            )}
          </div>
        </div>
{/* 
        <ReceptionSidePanel setSubView={setSubView} stats={financialMetrics} /> */}
      </div>
    </div>
  );
}

export default ReceptionistDash;