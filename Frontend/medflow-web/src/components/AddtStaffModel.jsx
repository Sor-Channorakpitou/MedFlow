import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function AddStaffModal({ isSuperAdmin, onClose, onSaved }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/users/roles')
            .then(res => {
                let list = Array.isArray(res.data) ? res.data : [];
                if (!isSuperAdmin) {
                    list = list.filter(r => r.name !== 'ADMIN');
                }
                setRoles(list);
                if (list.length > 0) setRoleId(String(list[0].id));
            })
            .catch(() => setError('Failed to load roles.'));
    }, [isSuperAdmin]);

    const handleSubmit = async () => {
        if (!name || !email || !password || !dateOfBirth || !roleId) {
            setError('All required fields must be filled.');
            return;
        }
        setIsSaving(true);
        setError('');
        try {
            await api.post('/users', {
                name, email, phone, dateOfBirth, password,
                roleId: Number(roleId),
            });
            onSaved();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create staff member.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900">Add Staff Member</h3>
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
                        <label className="block font-semibold text-gray-600 mb-1">Name *</label>
                        <input value={name} placeholder="Full Name" onChange={e => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Email *</label>
                        <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Phone</label>
                        <input value={phone} placeholder="Phone Number" onChange={e => setPhone(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Date of Birth *</label>
                        <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Password *</label>
                        <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-600 mb-1">Role *</label>
                        <select value={roleId} onChange={e => setRoleId(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200">
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end items-center mt-5 pt-4 border-t border-gray-100 gap-2">
                    <button onClick={onClose}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isSaving}
                        className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-60">
                        {isSaving ? 'Creating...' : 'Create Staff'}
                    </button>
                </div>
            </div>
        </div>
    );
}