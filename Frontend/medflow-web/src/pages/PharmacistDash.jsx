import { useState, useMemo, useEffect } from "react";
import PendingFulfillmentList from "../components/pharmacist/PendingFulfillmentList";
import AllergyBanner from "../components/pharmacist/AllergyBanner";
import MedicationDispensation from "../components/pharmacist/MedicationDispensation";
import Header from "../components/Header";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import { dispensePrescription } from "../services/prescriptionAPI";
import { useWorkflow } from "../hooks/useWorkFlow";
import { updateQueue } from "../services/queueAPI";
import { AlertCircle, Package } from "lucide-react";

function PharmacistDash() {
  const {
    prescriptions: rawPrescriptions,
    loading: isLoading,
  } = useWorkflow();

  const { toasts, showToast, dismissToast } = useToast();

  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState("queue"); // 'queue' or 'dispense'

  const currentUser = {
    name: "Alex Rivera, PharmD",
    role: "Chief Clinical Pharmacist",
    initials: "AR",
  };

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
          queueId: prescription.queueId || null,
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

  const handleFinalizeDischarge = async () => {
    if (!activePrescription) return;

    try {
      const targetId = Number(activePrescription.prescriptionId);

      await dispensePrescription(targetId);

      setSelectedPrescriptionId("");
      setMobileView("queue");
      showToast("Prescription dispensed successfully.", "success");
    } catch (err) {
      console.error("Discharge execution error: ", err);
      showToast("Failed to dispense prescription.", "error");
    }
  };

  const handleSelectPatient = async (id) => {
    setSelectedPrescriptionId(id);
    setMobileView("dispense");
    const entry = reactiveQueue.find((p) => p.id === id);
    if (entry?.queueId) {
      try {
        await updateQueue(entry.queueId, { status: "PROCESSING" });
      } catch {
        /* silent */
      }
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          user={currentUser}
          searchPlaceholder="Filter prescriptions..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hasNotifications={true}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading pharmacy dashboard...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!activePrescription) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          user={currentUser}
          searchPlaceholder="Filter prescriptions..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hasNotifications={true}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            All prescriptions dispensed
          </h3>
          <p className="text-sm text-gray-600 text-center max-w-md">
            All pending prescriptions have been successfully fulfilled and cleared for discharge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Header
        user={currentUser}
        searchPlaceholder="Filter prescriptions..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={true}
      />

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex gap-4 px-4 overflow-x-auto -mb-px">
          <button
            onClick={() => setMobileView("queue")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              mobileView === "queue"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Queue ({reactiveQueue.length})
          </button>
          <button
            onClick={() => setMobileView("dispense")}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              mobileView === "dispense"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Dispense
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 2xl:px-10 py-4 sm:py-5 lg:py-6">
        
        {/* Queue Panel */}
        <div
          className={`${
            mobileView === "dispense" ? "hidden lg:flex" : "flex"
          } w-full lg:w-80 flex-shrink-0 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm flex-col min-h-0 overflow-hidden`}
        >
          <PendingFulfillmentList
            patients={reactiveQueue}
            selectedId={activePrescription.id}
            onSelect={handleSelectPatient}
          />
        </div>

        {/* Dispense Panel */}
        <div
          className={`${
            mobileView === "queue" ? "hidden lg:flex" : "flex"
          } flex-1 flex-col gap-4 sm:gap-5 min-h-0 overflow-hidden`}
        >
          {/* Allergy Banner */}
          <div className="flex-shrink-0">
            <AllergyBanner text={activePrescription.allergies} />
          </div>

          {/* Medication Dispensation */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-6 min-h-0 overflow-y-auto">
            <MedicationDispensation
              patient={activePrescription}
              onFinalize={handleFinalizeDischarge}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PharmacistDash;