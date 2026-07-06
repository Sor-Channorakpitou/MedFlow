import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";

function PrescriptionOrderEntry({ onAdd, allMedications = [] }) {
  const [selectedMed, setSelectedMed] = useState("");
  const [dose, setDose] = useState("10mg");
  const [freq, setFreq] = useState("1");
  const [duration, setDuration] = useState("7");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredMeds = useMemo(() => {
    if (!searchTerm) return allMedications;
    return allMedications.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, allMedications]);

  const handleSelect = (med) => {
    setSearchTerm(med.name);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const medication = allMedications.find(
      (m) => m.name.toLowerCase() === searchTerm.toLowerCase(),
    );

    if (!medication) {
      alert("Please select a valid medication from the list.");
      return;
    }

    onAdd({
      medicationId: medication.id,
      name: medication.name,
      dosage: parseInt(dose) || 0,
      frequency: parseInt(freq) || 1,
      duration: duration,
    });

    setSearchTerm("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-left">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">
        Prescription Entry
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3 relative">
        {/* Searchable Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search medication..."
            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-teal-600"
          />

          {/* Suggestion Dropdown */}
          {isDropdownOpen && searchTerm && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
              {filteredMeds.map((med) => (
                <div
                  key={med.id}
                  onClick={() => handleSelect(med)}
                  className="p-2 text-xs cursor-pointer hover:bg-slate-50 border-b last:border-0"
                >
                  {med.name}{" "}
                  <span className="text-gray-400">
                    (Stock: {med.stockQuantity})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="Dose (mg)"
              title="Enter the medication dosage in milligrams"
              className="border rounded-lg p-2 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Frequency Input */}
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              placeholder="Freq"
              title="Enter number of times per day"
              className="border rounded-lg p-2 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Duration Input */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Days"
              title="Enter total duration in days"
              className="border rounded-lg p-2 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg text-xs font-bold"
        >
          Add to Plan
        </button>
      </form>
    </div>
  );
}

export default PrescriptionOrderEntry;
