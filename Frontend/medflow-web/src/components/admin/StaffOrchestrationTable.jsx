import React, { useMemo } from 'react';
import { Filter, MoreVertical } from 'lucide-react';

function StaffOrchestrationTable({ selectedDept, onDeptChange, appointments = [] }) {
  // Calculate how many patients are currently waiting for doctors
  const activeConsultLoad = appointments.filter(a => a.workflow_step === 'AWAITING_CONSULTATION').length;

  const personnel = useMemo(() => {
    // If you add a 'staff' array to your context later, you would map over it here.
    // For now, we update the static staff list's workload dynamically based on the queue.
    const baseStaff = [
      { name: 'Dr. Sarah Chen', email: 'sarah.c@medflow.com', avatar: 'SC', role: 'Senior Resident', dept: 'Cardiology', status: 'Active' },
      { name: 'Dr. Aris Vance', email: 'aris.v@medflow.com', avatar: 'AV', role: 'Attending Physician', dept: 'Emergency', status: 'Active' },
      { name: 'Elena Petrova', email: 'e.petrova@medflow.com', avatar: 'EP', role: 'Physician Assistant', dept: 'General Ward', status: 'Inactive' },
    ];

    return baseStaff.map((staff, index) => {
      // Distribute the current load to active doctors as a demonstration of dynamic binding
      const currentLoad = staff.status === 'Active' ? (index === 0 ? Math.ceil(activeConsultLoad / 2) : Math.floor(activeConsultLoad / 2)) : 0;
      
      return {
        ...staff,
        loadCount: currentLoad,
        load: currentLoad === 1 ? '1 Patient' : currentLoad > 1 ? `${currentLoad} Patients` : 'Unassigned'
      };
    }).filter(staff => selectedDept === 'All Departments' || staff.dept === selectedDept);
  }, [appointments, selectedDept]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-900">Staff Orchestration</h3>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative flex items-center border border-gray-200 rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-400 mr-2" />
            <select
              value={selectedDept}
              onChange={(e) => onDeptChange(e.target.value)}
              className="text-xs font-semibold text-gray-700 bg-transparent border-none outline-none pr-6 cursor-pointer appearance-none"
            >
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>Emergency</option>
              <option>General Ward</option>
            </select>
          </div>
          <button className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-3.5">Clinical Staff</th>
              <th className="px-6 py-3.5">Role & Dept</th>
              <th className="px-6 py-3.5">Current Load</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {personnel.map((staff, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[11px] border border-indigo-100 shadow-sm">
                    {staff.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{staff.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{staff.email}</p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-800 block">{staff.role}</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">{staff.dept}</span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {staff.loadCount > 0 ? (
                      <>
                        <div className="flex -space-x-1">
                          <div className="w-4 h-4 rounded-full bg-teal-600 text-[8px] font-bold text-white flex items-center justify-center border border-white">P1</div>
                          {staff.loadCount > 1 && <div className="w-4 h-4 rounded-full bg-blue-500 text-[8px] font-bold text-white flex items-center justify-center border border-white">P2</div>}
                          {staff.loadCount > 2 && (
                            <div className="w-4 h-4 rounded-full bg-gray-200 text-[7px] font-bold text-gray-600 flex items-center justify-center border border-white">+{staff.loadCount - 2}</div>
                          )}
                        </div>
                        <span className="font-medium text-gray-600">{staff.load}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 font-medium">{staff.load}</span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all duration-200 ${
                        staff.status === 'Active' ? 'bg-teal-600 justify-end' : 'bg-gray-200 justify-start'
                      }`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-sm" />
                    </button>
                    <span className="font-semibold text-gray-700">{staff.status}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-3 py-1.5 rounded-md transition-all shadow-sm">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-medium text-gray-400">
        <span>Showing {personnel.length} clinical staff members</span>
      </div>
    </div>
  );
}

export default StaffOrchestrationTable;