import React from 'react';

function WorkloadBreakdown() {
  const departments = [
    { name: 'Emergency', load: 92, color: 'bg-rose-600' },
    { name: 'Cardiology', load: 74, color: 'bg-teal-700' },
    { name: 'General Ward', load: 45, color: 'bg-teal-600' },
    { name: 'Pediatrics', load: 61, color: 'bg-teal-600' },
    { name: 'Radiology', load: 28, color: 'bg-teal-600' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col justify-between">
      <div className="border-b border-gray-50 pb-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900">Department Workload</h3>
      </div>

      <div className="space-y-4 my-auto mt-3">
        {departments.map((dept, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs py-2 font-semibold">
              <span className="text-gray-700">{dept.name}</span>
              <span className="text-gray-900">{dept.load}%</span>
            </div>
            
            {/* Outer Progress track trackframe */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${dept.color} rounded-full transition-all duration-500`} 
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