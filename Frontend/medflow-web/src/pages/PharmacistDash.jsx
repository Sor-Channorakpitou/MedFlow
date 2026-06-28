// src/pages/PharmacistDash.jsx
import React, { useState, useMemo, useEffect } from 'react';
import PendingFulfillmentList from '../components/pharmacist/PendingFulfillmentList';
import AllergyBanner from '../components/pharmacist/AllergyBanner';
import MedicationDispensation from '../components/pharmacist/MedicationDispensation';
import Header from '../components/Header';

import { useWorkflow } from "../context/WorkflowContext";

function PharmacistDash() {
  // Connect directly to the global pipeline engine
  const { 
    appointments = [], 
    patients = [], 
    prescriptions = [], 
    prescriptionItems = [], 
    dispenseMedications,
    togglePrescriptionItemCheck // FIX: Pull this cleanly directly from the hook execution scope
  } = useWorkflow();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = {
    name: "Alex Rivera, PharmD",
    role: "Chief Clinical Pharmacist",
    initials: "AR",
  };

  // ==========================================================================
  // RELATIONAL DATA JOIN: Assemble queue matching 'AWAITING_PHARMACY'
  // ==========================================================================
  const reactiveQueue = useMemo(() => {
    return appointments
      .filter((app) => app.workflow_step === "AWAITING_PHARMACY")
      .map((app) => {
        const patientInfo = patients.find((p) => p.patient_id === app.patient_id);
        
        // Find the master prescription record tied to this appointment
        const masterPrescription = prescriptions.find((p) => p.appointment_id === app.appointment_id);

        // Filter and map out individual items belonging to this specific prescription header
        const uiMedications = prescriptionItems
          .filter((item) => item.prescription_id === masterPrescription?.prescription_id)
          .map((item) => ({
            id: item.item_id, // Match the true key structure generated in Context
            name: item.medication_name,
            type: item.type || "Prescribed Rx",
            instruction: item.instruction,
            qty: item.quantity,
            refills: item.refills,
            isDispensed: item.is_dispensed // Bind directly to the reactive global state array flag
          }));

        return {
          id: app.appointment_id, // Primary key selection map target
          prescriptionId: masterPrescription?.prescription_id || '',
          patientId: app.patient_id,
          name: patientInfo ? patientInfo.full_name : "Unknown Patient",
          dob: patientInfo ? new Date(patientInfo.DOB).toLocaleDateString() : "N/A",
          medCount: uiMedications.length,
          prescriber: "Attending Physician",
          prescribedTime: new Date(app.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          waitTime: "Ready to Fill",
          isUrgent: app.urgency_level === 4 || app.urgency_level === "HIGH",
          allergies: masterPrescription?.allergies || "No Known Drug Allergies (NKDA)",
          medications: uiMedications
        };
      })
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [appointments, patients, prescriptions, prescriptionItems, searchQuery]);

  // Handle auto-selection tracking as patients enter/exit the workflow step
  useEffect(() => {
    if (reactiveQueue.length > 0) {
      // If our current selection isn't in the active queue anymore, reset it to the first item
      const missingOrUnset = !selectedPatientId || !reactiveQueue.some(p => p.id === selectedPatientId);
      if (missingOrUnset) {
        setSelectedPatientId(reactiveQueue[0].id);
      }
    } else {
      setSelectedPatientId('');
    }
  }, [reactiveQueue, selectedPatientId]);

  const activePatient = useMemo(() => {
    return reactiveQueue.find(p => p.id === selectedPatientId) || null;
  }, [reactiveQueue, selectedPatientId]);

  // ==========================================================================
  // DISPENSE ITEM TOGGLE HANDLER
  // ==========================================================================
  const handleToggleDispense = (medItemId) => {
    if (!togglePrescriptionItemCheck) {
      console.error("Context function togglePrescriptionItemCheck is missing!");
      return;
    }
    // Pass the target item ID up to change its checked/dispensed boolean value
    togglePrescriptionItemCheck(medItemId);
  };

  // ==========================================================================
  // FINALIZE DISCHARGE: Clear patient workflow pipeline target to CHECKOUT
  // ==========================================================================
  const handleFinalizeDischarge = () => {
    if (!activePatient) return;

    const allChecked = activePatient.medications.every(m => m.isDispensed);
    if (!allChecked) {
      alert(`Validation Pending: Please verify and check off all prescriptions before discharge.`);
      return;
    }

    // Fire state mutation engine forwarding patient on to final invoicing counters
    if (dispenseMedications) {
      dispenseMedications(activePatient.id, activePatient.prescriptionId);
    }

    // Reset selection state clean
    setSelectedPatientId('');
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden text-left">

      {/* Dynamic Top Search & Alert Action Rail */}
      <Header
        user={currentUser}
        searchPlaceholder="Filter dispensary records..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={true}
      />

      {activePatient ? (
        /* Main Core View Area Frame splits */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 p-6 gap-6 min-h-0 overflow-hidden">

          {/* Master Queue Panel (Left 1 Column) */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <PendingFulfillmentList
              patients={reactiveQueue}
              selectedId={selectedPatientId}
              onSelect={setSelectedPatientId}
            />
          </div>

          {/* Workspace Operations Panel (Right 2 Columns) */}
          <div className="lg:col-span-2 flex flex-col space-y-4 h-full overflow-y-auto pr-1">
            <AllergyBanner text={activePatient.allergies} />

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <MedicationDispensation
                patient={activePatient}
                onToggleMed={handleToggleDispense} // FIX: Pass down our secure local callback proxy handler
                onFinalize={handleFinalizeDischarge}
              />
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
          <p className="text-sm font-medium">All pending prescriptions have been fully compiled and cleared for discharge.</p>
        </div>
      )}
    </div>
  );
}

export default PharmacistDash;