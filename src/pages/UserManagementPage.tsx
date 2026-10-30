/**
 * APAAR CONNECT AI - User & Nodal Officer Management
 * Directory of AICTE national administrators, university registrars, and authorized verifiers.
 */

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Shield,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Edit2,
  Lock,
} from 'lucide-react';
import { User, Institution } from '../types';
import { DEMO_USERS } from '../data/defaultData';

interface UserManagementPageProps {
  currentUser: User;
  institutions: Institution[];
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  currentUser,
  institutions,
}) => {
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'aicte_admin' | 'institution_admin' | 'verifier'>('institution_admin');
  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || '');
  const [designation, setDesignation] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = institutions.find((i) => i.id === institutionId);
    const newUser: User = {
      id: `USER-${Date.now()}`,
      name,
      email,
      role,
      institutionId: role === 'institution_admin' ? institutionId : undefined,
      institutionName: role === 'institution_admin' ? inst?.name : undefined,
      designation: designation || (role === 'institution_admin' ? 'College Nodal Officer' : 'Auditor'),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setDesignation('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>Nodal Officers & User Governance</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-600/30 text-cyan-300 font-semibold border border-blue-500/30">
              Role-Based Access Control (RBAC)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage institutional nodal officers, council regulators, and credential verification personnel.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Nodal Officer</span>
        </button>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-5 rounded-2xl bg-[#121c3b] border border-[#213564] hover:border-cyan-500/40 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={u.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#24355a]"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{u.name}</h4>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                      u.role === 'aicte_admin'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : u.role === 'institution_admin'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Active"></span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">{u.designation}</p>

            <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-[#1e2f58]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px] truncate">{u.email}</span>
              </div>
              {u.institutionName && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{u.institutionName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101b35] border border-[#233560] rounded-2xl max-w-md w-full p-6 text-white shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#233560] pb-3 mb-4">
              <h3 className="font-bold text-base text-white">Register Nodal Officer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. K. Radhakrishnan"
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nodal.officer@institution.ac.in"
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Permission Level</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="institution_admin">College Nodal Officer (Institution Admin)</option>
                  <option value="verifier">Authorized Verifier</option>
                  <option value="aicte_admin">AICTE Regulatory Administrator</option>
                </select>
              </div>

              {role === 'institution_admin' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Institution</label>
                  <select
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {institutions.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Dean of Admissions"
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 border-t border-[#233560] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#162244] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Add Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
