import React, { useState } from 'react';
import { Plus } from 'lucide-react';

function PrescriptionOrderEntry({ onAdd, allMedications = [] }) {
  const [selectedMed, setSelectedMed] = useState(''); // Stores the ID
  const [dose, setDose] = useState('10mg');
  const [freq, setFreq] = useState('1');
  const [duration, setDuration] = useState('7');


//   const formattedMedications = medications.map(med => ({
//   ...med,
//   dosage: med.dosage === "" || med.dosage === null ? 0 : Number(med.dosage)
// }));



  const handleSubmit = (e) => {
    e.preventDefault();
    const medication = allMedications.find(m => m.id.toString() === selectedMed);
    if (!medication) {
      alert("Please select a valid medication from the list.");
      return;
    }
    
    // Clean the data: Extract only numbers from the dose string (e.g., "10mg" -> 10)
    const numericDose = parseInt(dose.replace(/[^0-9]/g, '')) || 0;
    const numericFreq = parseInt(freq) || 1;

    onAdd({ 
      medicationId: medication.id, 
      name: medication.name, 
      dosage: numericDose,      // Now a clean number
      frequency: numericFreq,   // Now a clean number
      duration: duration        // Keep as string if your Zod expects a string
    });
    setSelectedMed('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-left">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Prescription Entry</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Dropdown for Database Selection */}
        <select 
          value={selectedMed} 
          onChange={(e) => setSelectedMed(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-teal-600"
        >
          <option value="">Select Medication...</option>
          {allMedications.map((med) => (
            <option key={med.id} value={med.id}>{med.name} (Stock: {med.stockQuantity})</option>
          ))}
        </select>

        <div className="grid grid-cols-3 gap-2">
          {/* Inputs for Dose, Freq, Duration remain the same */}
         <input 
  type="number" // Changed to number
  value={dose} 
  onChange={(e) => setDose(e.target.value)} 
  placeholder="Dose (mg)" 
  className="border rounded-lg p-2 text-xs" 
/>
          <input type="number" value={freq} onChange={(e) => setFreq(e.target.value)} placeholder="Freq" className="border rounded-lg p-2 text-xs" />
          <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Days" className="border rounded-lg p-2 text-xs" />
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded-lg text-xs font-bold">
          Add to Plan
        </button>
      </form>
    </div>
  );
}

export default PrescriptionOrderEntry;