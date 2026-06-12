import React, { useMemo } from 'react';

function WorkloadBreakdown({ appointments = [] }) {
  // Dynamically calculate workload breakdown based on the appointments array
  const departments = useMemo(() => {
    const total = appointments.length || 1; // Prevent division by zero
    
    // Simulating department routing based on urgency/reason if explicit departments aren't in the schema yet
    const emergencyCount = appointments.filter(a => a.urgency_level === 'CRITICAL' || a.urgency_level === 'HIGH').length;
    const generalCount = appointments.filter(a => a.urgency_level === 'MEDIUM' || a.urgency_level === 'LOW').length;
    const otherCount = appointments.length - (emergencyCount + generalCount);

    return [
      { name: 'Emergency', load: Math.round((emergencyCount / total) * 100) || 0, color: 'bg-rose-600' },
      { name: 'General Ward', load: Math.round((generalCount / total) * 100) || 0, color: 'bg-teal-600' },
      { name: 'Specialists', load: Math.round((otherCount / total) * 100) || 0, color: 'bg-blue-600' },
      // Added a fixed tracker for visual consistency
      { name: 'Radiology', load: appointments.length > 0 ? 15 : 0, color: 'bg-indigo-500' }, 
    ].sort((a, b) => b.load - a.load); // Auto-sort highest load to the top
  }, [appointments]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col justify-between">
      <div className="border-b border-gray-50 pb-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900">Department Workload</h3>
      </div>

      <div className="space-y-5 my-auto mt-3">
        {departments.map((dept, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs py-1 font-semibold">
              <span className="text-gray-700">{dept.name}</span>
              <span className="text-gray-900">{dept.load}%</span>
            </div>
            
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${dept.color} rounded-full transition-all duration-700 ease-in-out`} 
                style={{ width: `${dept.load}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkloadBreakdown;