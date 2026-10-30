/**
 * APAAR CONNECT AI - Alerts & Notification Intelligence Centre
 * Real-time monitoring of regulatory breaches, duplicate conflicts,
 * and automated dispatch logs (Simulated SMS/Email).
 */

import React, { useState } from 'react';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Mail,
  Smartphone,
  Check,
  Filter,
  ArrowRight,
  Clock,
  Shield,
} from 'lucide-react';
import { AlertNotification } from '../types';

interface AlertsCentrePageProps {
  notifications: AlertNotification[];
  onMarkRead: (id: string) => void;
  onResolveAlert: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const AlertsCentrePage: React.FC<AlertsCentrePageProps> = ({
  notifications,
  onMarkRead,
  onResolveAlert,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'RESOLVED'>('ALL');

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    if (filter === 'RESOLVED') return n.isResolved;
    if (filter === 'CRITICAL') return n.severity === 'CRITICAL' && !n.isResolved;
    if (filter === 'WARNING') return n.severity === 'WARNING' && !n.isResolved;
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertOctagon className="w-3 h-3" /> CRITICAL REGULATORY
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" /> WARNING
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
            <Info className="w-3 h-3" /> NOTICE
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
              <Bell className="w-5 h-5 text-cyan-400" />
              <span>Regulatory Alerts & Notifications Centre</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-600/30 text-cyan-300 font-semibold border border-blue-500/30">
              Automated Institutional Dispatches
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Instant event triggers detecting intake threshold exceedance, concurrent enrolment flags,
            missing APAAR registrations, and compliance deadlines.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[#101b35] p-1 rounded-xl border border-[#233560] text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'CRITICAL' ? 'bg-red-600 text-white' : 'text-red-400 hover:text-white'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilter('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'WARNING' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-white'
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filter === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#121c3b] rounded-2xl border border-[#213564]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="font-bold text-white text-sm">No Alerts in this Category</p>
            <p className="text-xs text-slate-400 mt-1">
              All compliance events matching selected filter have been handled.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.isResolved
                  ? 'bg-[#101933] border-[#1d2d56] opacity-75'
                  : item.severity === 'CRITICAL'
                  ? 'bg-gradient-to-r from-[#211224] to-[#121c3b] border-red-500/60 shadow-lg'
                  : 'bg-[#121c3b] border-[#213564]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getSeverityBadge(item.severity)}
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <span className="text-xs text-slate-400 font-mono">• {item.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    {item.institutionName && (
                      <span>
                        Target: <strong className="text-slate-300">{item.institutionName}</strong>
                      </span>
                    )}
                    {item.programmeName && (
                      <span>
                        Stream: <strong className="text-slate-300">{item.programmeName}</strong>
                      </span>
                    )}
                  </div>

                  {/* Simulated Dispatch Log */}
                  {item.dispatchLog && (
                    <div className="p-2.5 rounded-lg bg-[#0e172e] border border-[#1e2f58] text-[11px] text-slate-300 flex flex-wrap items-center gap-3">
                      <span className="text-slate-400 font-semibold">Simulated Gateway Notice:</span>
                      {item.dispatchLog.emailSent && (
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" /> AICTE Formal Email Dispatched
                        </span>
                      )}
                      {item.dispatchLog.smsSent && (
                        <span className="flex items-center gap-1 text-emerald-300">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Nodal SMS Alert Sent
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        (Synthetic Demonstration Log)
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center md:flex-col gap-2 shrink-0 justify-end md:min-w-[130px]">
                  {item.actionUrl && (
                    <button
                      onClick={() => onNavigate(item.actionUrl!.replace('/', ''))}
                      className="w-full px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!item.isResolved && (
                    <button
                      onClick={() => onResolveAlert(item.id)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#18264e] hover:bg-[#203366] text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Handled</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
