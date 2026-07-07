// src/pages/PharmacistDash.jsx
import { useState, useMemo, useEffect } from "react";
import PendingFulfillmentList from "../components/pharmacist/PendingFulfillmentList";
import AllergyBanner from "../components/pharmacist/AllergyBanner";
import MedicationDispensation from "../components/pharmacist/MedicationDispensation";
import Header from "../components/Header";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";

import { useWorkflow } from "../hooks/useWorkflow";

function PharmacistDash() {
  const { 
    prescriptions: rawPrescriptions, 
    loading: isLoading, 
    dispensePrescription 
  } = useWorkflow();

  const { toasts, showToast, dismissToast } = useToast();
  
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = {
    name: "Alex Rivera, PharmD",
    role: "Chief Clinical Pharmacist",
    initials: "AR",
  };

  // 1. Safe, exception-free reactive queue parsing
  const reactiveQueue = useMemo(() => {
    const safePrescriptions = Array.isArray(rawPrescriptions) ? rawPrescriptions : [];

    return safePrescriptions
      .map((prescription) => {
        if (!prescription) return null;

        const patient = prescription.patient || {};

        const uiMedications =
          prescription.prescriptionMedications?.map((item) => ({
            id: item.id,
            name: item.medication?.name || "Unknown Medicine",
            type: "Prescribed Rx",
            instruction: `${item.frequency || 1}x daily for ${item.duration || "7 Days"}`,
            qty: item.dosage || 1,
            refills: item.refills || 0,
            isDispensed: item.isDispensed || false,
          })) || [];

        return {
          id: prescription.id,
          prescriptionId: prescription.id,
          patientId: patient.id || null,
          name: (patient.fullName || "UNKNOWN PATIENT").toUpperCase(),
          dob: patient.dateOfBirth
            ? new Date(patient.dateOfBirth).toLocaleDateString()
            : "N/A",
          medCount: uiMedications.length,
          prescriber: prescription.user?.name || "Attending Physician",
          prescribedTime: prescription.createdAt
            ? new Date(prescription.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          waitTime: "Ready to Fill",
          allergies:
            prescription.medicalRecord?.allergies ||
            "No Known Drug Allergies (NKDA)",
          medications: uiMedications,
          diagnosis: prescription.medicalRecord?.diagnosis || "",
          notes: prescription.medicalRecord?.notes || "",
        };
      })
      .filter(Boolean)
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [rawPrescriptions, searchQuery]);

  useEffect(() => {
    if (reactiveQueue.length > 0 && !selectedPrescriptionId) {
      setSelectedPrescriptionId(reactiveQueue[0].id);
    }
  }, [reactiveQueue, selectedPrescriptionId]);


  const activePrescription = useMemo(() => {
    if (reactiveQueue.length === 0) return null;

    const currentActive = reactiveQueue.find(
      (p) => p.id === selectedPrescriptionId,
    );
   
    return currentActive || reactiveQueue[0];
  }, [reactiveQueue, selectedPrescriptionId]);

  // const handleToggleDispense = (medItemId) => {
  //   console.log(`Toggling item dispensation status for item ID: ${medItemId}`);
  // };

  const handleFinalizeDischarge = async () => {
    if (!activePrescription) return;

    try {
      const targetId = Number(activePrescription.prescriptionId);
      
    
      await dispensePrescription(targetId);

      setSelectedPrescriptionId("");
      showToast("Prescription dispensed successfully.", "success");
    } catch (err) {
      console.error("Discharge execution error: ", err);
      showToast("Failed to dispense prescription.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 font-medium">
        Syncing global pharmacy dashboards...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden text-left">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Header
        user={currentUser}
        searchPlaceholder="Filter dispensary records..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={true}
      />

      {activePrescription ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 p-6 gap-6 min-h-0 overflow-hidden">

          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <PendingFulfillmentList
              patients={reactiveQueue}
              selectedId={activePrescription.id}
              onSelect={setSelectedPrescriptionId}
            />
          </div>

        
          <div className="lg:col-span-2 flex flex-col space-y-4 h-full overflow-y-auto pr-1">
            <AllergyBanner text={activePrescription.allergies} />

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <MedicationDispensation
                patient={activePrescription}
                // onToggleMed={handleToggleDispense}
                onFinalize={handleFinalizeDischarge}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
          <p className="text-sm font-medium">
            All pending prescriptions have been fully compiled and cleared for discharge.
          </p>
        </div>
      )}
    </div>
  );
}

export default PharmacistDash;