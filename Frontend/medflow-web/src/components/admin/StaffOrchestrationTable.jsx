import React from 'react';
import { Filter, MoreVertical } from 'lucide-react';

function StaffOrchestrationTable({ selectedDept, onDeptChange }) {
  const personnel = [
    {
      name: 'Dr. Sarah Chen',
      email: 'sarah.c@medflow.com',
      avatar: 'SC',
      role: 'Senior Resident',
      dept: 'Cardiology',
      load: '4 Patients',
      loadCount: 4,
      status: 'Active',
    },
    {
      name: 'Dr. Sarah Chen',
      email: 'sarah.c@medflow.com',
      avatar: 'SC',
      role: 'Senior Resident',
      dept: 'Cardiology',
      load: '4 Patients',
      loadCount: 4,
      status: 'Active',
    },
    {
      name: 'Mark Bennet',
      email: 'm.bennet@medflow.com',
      avatar: 'MB',
      role: 'Lead Nurse',
      dept: 'Emergency',
      load: '1 Patient',
      loadCount: 1,
      status: 'Active',
    },
    {
      name: 'Elena Petrova',
      email: 'e.petrova@medflow.com',
      avatar: 'EP',
      role: 'Physician Assistant',
      dept: 'General Ward',
      load: 'Unassigned',
      loadCount: 0,
      status: 'Inactive',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      
      {/* Table Title and Filtering Control Bars */}
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

      {/* Main Core Document Grid Layout Table Frame */}
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
                {/* Identity profile cell */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-[11px] border border-indigo-100 shadow-sm">
                    {staff.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{staff.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{staff.email}</p>
                  </div>
                </td>

                {/* Role specifications */}
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-800 block">{staff.role}</span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">{staff.dept}</span>
                </td>

                {/* Workloads capacity cell metrics */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {staff.loadCount > 0 ? (
                      <>
                        <div className="flex -space-x-1">
                          <div className="w-4 h-4 rounded-full bg-teal-600 text-[8px] font-bold text-white flex items-center justify-center border border-white">JS</div>
                          <div className="w-4 h-4 rounded-full bg-blue-500 text-[8px] font-bold text-white flex items-center justify-center border border-white">MK</div>
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

                {/* Account Status Switch Controls toggle indicators */}
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

                {/* Context trigger controls row settings */}
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

      {/* Pagination control rails matching layout system requirements */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-medium text-gray-400">
        <span>Showing 3 of 86 clinical staff members</span>
        <div className="flex items-center gap-1">
          <button className="px-2.5 py-1 border border-gray-200 rounded bg-white text-gray-400 font-semibold cursor-not-allowed">Previous</button>
          <button className="px-2.5 py-1 border border-teal-600 bg-teal-600 text-white font-bold rounded shadow-sm">1</button>
          <button className="px-2.5 py-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded shadow-sm transition-all">2</button>
          <button className="px-2.5 py-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded font-semibold shadow-sm transition-all">Next</button>
        </div>
      </div>

    </div>
  );
}

export default StaffOrchestrationTable;