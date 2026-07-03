// src/pages/PharmacistDash.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import PendingFulfillmentList from "../components/pharmacist/PendingFulfillmentList";
import AllergyBanner from "../components/pharmacist/AllergyBanner";
import MedicationDispensation from "../components/pharmacist/MedicationDispensation";
import Header from "../components/Header";

import {
  getPendingPrescriptions,
  dispensePrescription,
} from "../services/prescriptionAPI";

function PharmacistDash() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = {
    name: "Alex Rivera, PharmD",
    role: "Chief Clinical Pharmacist",
    initials: "AR",
  };

  // ==========================================================================
  // FETCH ENGINE
  // ==========================================================================
  const loadPharmacyDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await getPendingPrescriptions();

      if (response && response.prescriptions) {
        setPrescriptions(response.prescriptions);
        // Safely set the initial selection immediately upon fetch
        if (response.prescriptions.length > 0) {
          setSelectedPrescriptionId(response.prescriptions[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch eager-loaded prescriptions:", err);
      setApiError(
        "Database sync failed. Could not pull prescription registries.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPharmacyDashboard();
  }, [loadPharmacyDashboard]);

  // Transform raw DB schema to pristine UI layout structures
  const reactiveQueue = useMemo(() => {
    return prescriptions
      .map((prescription) => {
        const patient = prescription.patient || {};

        const uiMedications =
          prescription.prescriptionMedications?.map((item) => ({
            id: item.id,
            name: item.medication?.name || "Unknown Medicine",
            type: "Prescribed Rx",
            instruction: `${item.frequency}x daily for ${item.duration}`,
            qty: item.dosage,
            refills: item.refills || 0,
            isDispensed: item.isDispensed || false,
          })) || [];

        return {
          id: prescription.id,
          prescriptionId: prescription.id,
          patientId: patient.id || null,
          name: patient.fullName || "UNKNOWN PATIENT",
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
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [prescriptions, searchQuery]);

  // Derived Active Prescription (No useEffect loop hazard)
  const activePrescription = useMemo(() => {
    if (reactiveQueue.length === 0) return null;

    const currentActive = reactiveQueue.find(
      (p) => p.id === selectedPrescriptionId,
    );
    // Fallback safely to the first matched search/queue item if selection gets lost
    return currentActive || reactiveQueue[0];
  }, [reactiveQueue, selectedPrescriptionId]);

  const handleToggleDispense = (medItemId) => {
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.map((rx) => {
        // Use the fallback-safe activePrescription ID instead of raw state
        if (
          activePrescription &&
          rx.id === activePrescription.id &&
          rx.prescriptionMedications
        ) {
          return {
            ...rx,
            prescriptionMedications: rx.prescriptionMedications.map((item) =>
              item.id === medItemId
                ? { ...item, isDispensed: !item.isDispensed }
                : item,
            ),
          };
        }
        return rx;
      }),
    );
  };

  const handleFinalizeDischarge = async () => {
    if (!activePrescription) return;

    try {
      const targetId = Number(activePrescription.prescriptionId);
      await dispensePrescription(targetId);

      // Optimistically clean the state
      setPrescriptions((prev) => {
        const remaining = prev.filter((rx) => rx.id !== targetId);
        // Update selection state inline during the action step safely
        if (remaining.length > 0) {
          setSelectedPrescriptionId(remaining[0].id);
        } else {
          setSelectedPrescriptionId("");
        }
        return remaining;
      });
    } catch (err) {
      console.error("Discharge execution error: ", err);
      alert("Backend execution failed during validation confirmation routine.");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 font-medium">
        Loading clinical registries...
      </div>
    );
  if (apiError)
    return (
      <div className="flex h-screen items-center justify-center text-rose-500 font-medium">
        {apiError}
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden text-left">
      <Header
        user={currentUser}
        searchPlaceholder="Filter dispensary records..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={true}
      />

      {activePrescription ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 p-6 gap-6 min-h-0 overflow-hidden">
          {/* Master Queue List Grid Section */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <PendingFulfillmentList
              patients={reactiveQueue}
              selectedId={activePrescription.id} // Keep the UI in sync with derived data
              onSelect={setSelectedPrescriptionId}
            />
          </div>

          {/* Interactive Workspace Area Framework */}
          <div className="lg:col-span-2 flex flex-col space-y-4 h-full overflow-y-auto pr-1">
            <AllergyBanner text={activePrescription.allergies} />

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <MedicationDispensation
                patient={activePrescription}
                onToggleMed={handleToggleDispense}
                onFinalize={handleFinalizeDischarge}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
          <p className="text-sm font-medium">
            All pending prescriptions have been fully compiled and cleared for
            discharge.
          </p>
        </div>
      )}
    </div>
  );
}

export default PharmacistDash;
