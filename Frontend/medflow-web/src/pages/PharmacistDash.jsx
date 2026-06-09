import React, { useState } from 'react';
import PendingFulfillmentList from '../components/pharmacist/PendingFulfillmentList';
import AllergyBanner from '../components/pharmacist/AllergyBanner';
import MedicationDispensation from '../components/pharmacist/MedicationDispensation';
import Header from '../components/Header';

import { Search, Bell, Radio, User } from 'lucide-react';

function PharmacistDash() {
  // Master queue data configuration matrix
  const [patients, setPatients] = useState([
    {
      id: 'P-091',
      name: 'Eleanor Vance',
      dob: '04/12/1985',
      medCount: 3,
      prescriber: 'Dr. A. Montgomery',
      prescribedTime: '10:42 AM',
      waitTime: '12m wait',
      isUrgent: true,
      allergies: 'Penicillin Sensitivity (Severe Anaphylaxis). Cross-reactivity risk noted.',
      medications: [
        { id: 'm1', name: 'Azithromycin 250mg Tablet', type: 'Alternative Prescribed', instruction: 'Take 2 tablets on day 1, then 1 tablet daily for 4 days.', qty: 6, refills: 0, isDispensed: false },
        { id: 'm2', name: 'Ondansetron 4mg ODT', type: '', instruction: 'Dissolve 1 tablet on tongue every 8 hours as needed for nausea.', qty: 15, refills: 1, isDispensed: false },
        { id: 'm3', name: 'Ibuprofen 800mg Tablet', type: '', instruction: 'Take 1 tablet by mouth every 8 hours with food.', qty: 30, refills: 0, isDispensed: false },
      ]
    },
    {
      id: 'P-104',
      name: 'Marcus Chen',
      dob: '11/22/1990',
      medCount: 1,
      prescriber: 'Dr. S. Patel',
      prescribedTime: '10:35 AM',
      waitTime: '8m wait',
      isUrgent: false,
      allergies: 'No Known Drug Allergies (NKDA)',
      medications: [
        { id: 'm4', name: 'Amoxicillin 500mg Capsule', type: '', instruction: 'Take 1 capsule three times daily for 7 days.', qty: 21, refills: 0, isDispensed: false }
      ]
    },
    {
      id: 'P-088',
      name: 'Sarah Jenkins',
      dob: '07/03/1974',
      medCount: 2,
      prescriber: 'Dr. A. Montgomery',
      prescribedTime: '10:15 AM',
      waitTime: '2m wait',
      isUrgent: false,
      allergies: 'Sulfa Drugs',
      medications: [
        { id: 'm5', name: 'Lisinopril 10mg Tablet', type: '', instruction: 'Take 1 tablet daily in the morning.', qty: 30, refills: 3, isDispensed: false },
        { id: 'm6', name: 'Atorvastatin 20mg Tablet', type: '', instruction: 'Take 1 tablet daily at bedtime.', qty: 30, refills: 3, isDispensed: false }
      ]
    }
  ]);

  // Track active selection
  const [selectedPatientId, setSelectedPatientId] = useState('P-091');
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Toggle individual items inside dispensing checklists
  const handleToggleDispense = (medId) => {
    setPatients(prevPatients => prevPatients.map(p => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          medications: p.medications.map(m => m.id === medId ? { ...m, isDispensed: !m.isDispensed } : m)
        };
      }
      return p;
    }));
  };

  // Dispatch and close operations
  const handleFinalizeDischarge = () => {
    const filledCount = activePatient.medications.filter(m => m.isDispensed).length;
    if (filledCount !== activePatient.medications.length) {
      alert(`Validation Pending: Please verify and check off all prescriptions before discharge.`);
      return;
    }
    console.log(`POST /api/v1/dispensary/finalize ${activePatient.id}`);
    alert(`Prescription validated. Patient ${activePatient.name} cleared for discharge!`);
    // Remove patient from local queue state
    setPatients(prev => prev.filter(p => p.id !== activePatient.id));
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      
      {/* Dynamic Top Search & Alert Action Rail */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
        <Header />

    
      </div>

      {/* Main Core View Area Frame splits */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 p-6 gap-6 min-h-[calc(100vh-4rem)]">
        
        {/* Master Queue Panel (Left 1 Column) */}
        <div className="lg:col-span-1">
          <PendingFulfillmentList 
            patients={patients} 
            selectedId={selectedPatientId} 
            onSelect={setSelectedPatientId} 
          />
        </div>

        {/* Workspace Operations Panel (Right 2 Columns) */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <AllergyBanner text={activePatient.allergies} />
          
          <MedicationDispensation 
            patient={activePatient} 
            onToggleMed={handleToggleDispense} 
            onFinalize={handleFinalizeDischarge}
          />
        </div>

      </div>
    </div>
  );
}

export default PharmacistDash;