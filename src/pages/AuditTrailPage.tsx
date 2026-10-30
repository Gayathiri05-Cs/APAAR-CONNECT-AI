/**
 * APAAR CONNECT AI - Immutable Audit Trail & Security Log
 * Chronological ledger tracking user actions, batch uploads, validations,
 * duplicate resolutions, and cryptographic verifications.
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpDown,
  Lock,
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { exportToCsv } from '../utils/csvParser';

interface AuditTrailPageProps {
  auditLogs: AuditLogEntry[];
}

export const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const clean = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !clean ||
      log.action.toLowerCase().includes(clean) ||
      log.actorName.toLowerCase().includes(clean) ||
      log.details.toLowerCase().includes(clean) ||
      log.entityId.toLowerCase().includes(clean);

    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

    return matchesSearch && matchesEntity && matchesStatus;
  });

  const handleExportCsv = () => {
    const rows = filteredLogs.map((l) => ({
      'Log ID': l.id,
      'Timestamp': l.timestamp,
      'Actor Name': l.actorName,
      'Role': l.actorRole,
      'Email': l.actorEmail,
      'Action': l.action,
      'Entity Type': l.entityType,
      'Entity ID': l.entityId,
      'Status': l.status,
      'IP Address': l.ipAddress,
      'Details': l.details,
    }));
    exportToCsv(`AICTE_Audit_Trail_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> SUCCESS
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> WARNING
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
            <XCircle className="w-3 h-3" /> FAILURE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Immutable Regulatory Audit Trail</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              SHA-256 Ledger Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tamper-evident chronological record of all administrative transactions, data ingestions,
            regulatory overrides, duplicate resolutions, and cryptographic student verifications.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#152349] hover:bg-[#1d2f60] border border-[#233560] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#121c3b] border border-[#213564] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action, or keyword..."
            className="w-full bg-[#152244] border border-[#24355a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Event Types</option>
          <option value="STUDENT">Student Records</option>
          <option value="BATCH_UPLOAD">Batch Upload</option>
          <option value="VALIDATION">Validation</option>
          <option value="DUPLICATE">Duplicates</option>
          <option value="INTAKE">Intake Capacity</option>
          <option value="AUTH">Authentication</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUCCESS">Success Only</option>
          <option value="WARNING">Warnings</option>
          <option value="FAILURE">Failures</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0e172e] text-[11px] uppercase font-bold text-slate-400 tracking-wider border-b border-[#213564]">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Executed</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">IP / Gateway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2f58]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching audit log records.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#152349]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{log.actorName}</div>
                      <div className="text-[10px] text-cyan-300 capitalize">{log.actorRole.replace('_', ' ')}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-cyan-300">
                      {log.action}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-blue-900/40 text-slate-200 text-[10px] font-mono">
                        {log.entityType}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-300 text-[11px] line-clamp-2">{log.details}</p>
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(log.status)}</td>

                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
