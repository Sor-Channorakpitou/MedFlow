import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import * as userAPI from '../../services/userAPI';
import AddStaffModal from '../AddtStaffModel';

const ROLE_OPTIONS = ['All Roles', 'DOCTOR', 'NURSE', 'PHARMACIST', 'RECEPTIONIST'];

function ManageStaffModal({ staff, onClose, onSaved }) {
    const [name, setName] = useState(staff.name);
    const [email, setEmail] = useState(staff.email);
    const [phone, setPhone] = useState(staff.phone || '');
    const [role] = useState(staff.role?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        try {
            await userAPI.updateUser(staff.id, { name, email, phone });
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update staff member.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900">Manage Staff Member</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {error && (
                    <div className="mb-3 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}

                <div className="space-y-3 text-xs">
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Name</label>
                        <input
                            value={name}
                            placeholder='Full name'
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Email</label>
                        <input
                            value={email}
                            placeholder='Email address'
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Phone</label>
                        <input
                            value={phone}
                            placeholder='Phone number'
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Role</label>
                        <input
                            value={role}
                            disabled
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Role editing needs a roles lookup endpoint — ask me to wire this once available.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end items-center mt-5 pt-4 border-t border-gray-100 gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-60"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StaffOrchestrationTable({ 
    selectedDept, onDeptChange,
    staffList =[], loading = false, fetchStaff, setStaffList, error = false, isSuperAdmin = false
}) {

    const [managingStaff, setManagingStaff] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleToggleStatus = async (staff) => {
        setTogglingId(staff.id);
        try {
            const updated = staff.isActive ? await userAPI.deactivateUser(staff.id) : await userAPI.activateUser(staff.id);
            setStaffList(prev =>
                prev.map(s => (s.id === staff.id ? { ...s, isActive: updated.user.isActive } : s))
            );

        } catch (err) {
            console.error('Failed to toggle staff status:', err);
            alert(err.response?.data?.message || 'Failed to update staff status.');
        } finally {
            setTogglingId(null);
        }
    };

    const personnel = useMemo(() => {
        return [...staffList]
            .filter(staff => staff.role?.name !== "ADMIN" && (selectedDept === "All Roles" || staff.role?.name === selectedDept))
            .map(staff => {
                const initials = staff.name
                    ? staff.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                    : '?';

                return {
                    ...staff,
                    avatar: initials,
                };
            });
    }, [staffList, selectedDept]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900">Staff Mangement</h3>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button onClick={() => setShowAddModal(true)}
                        className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">
                        + Add Staff
                    </button>
                    <div className="relative flex items-center border border-gray-200 rounded-lg bg-white px-2.5 py-1.5 shadow-sm">
    <Filter className="w-4 h-4 text-gray-500 mr-2" />

    <select
        value={selectedDept}
        onChange={(e) => onDeptChange(e.target.value)}
        className="
            appearance-none
            bg-transparent
            text-sm
            font-medium
            text-gray-700
            pr-8
            cursor-pointer
            outline-none
            px-3
            rounded-xl
        "
    >
        {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
                {role}
            </option>
        ))}
    </select>

    <svg
        className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
        />
    </svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center text-xs text-gray-400">Loading staff...</div>
            ) : error ? (
                <div className="py-16 text-center text-xs text-rose-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-3.5">Clinical Staff</th>
                                <th className="px-6 py-3.5">Role</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {personnel.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50/80 transition-colors">
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
                                        <span className="font-semibold text-gray-800 block">{staff.role?.name || 'Unassigned'}</span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleStatus(staff)}
                                                disabled={togglingId === staff.id}
                                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    staff.isActive ? 'bg-teal-600 justify-end' : 'bg-gray-200 justify-start'
                                                }`}
                                            >
                                                <div className="bg-white w-4 h-4 rounded-full shadow-sm" />
                                            </button>
                                            <span className="font-semibold text-gray-700">
                                                {staff.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setManagingStaff(staff)}
                                            className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-3 py-1.5 rounded-md transition-all shadow-sm"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-medium text-gray-400">
                <span>Showing {personnel.length} clinical staff members</span>
            </div>

            {managingStaff && (
                <ManageStaffModal
                    staff={managingStaff}
                    onClose={() => setManagingStaff(null)}
                    onSaved={fetchStaff}
                />
            )}

            {showAddModal && (
                <AddStaffModal
                    isSuperAdmin={isSuperAdmin}
                    onClose={() => setShowAddModal(false)}
                    onSaved={fetchStaff}
                />
            )}
        </div>
    );
}

export default StaffOrchestrationTable;