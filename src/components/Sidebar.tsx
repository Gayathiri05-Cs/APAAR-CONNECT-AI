/**
 * APAAR CONNECT AI - Enterprise Navigation Sidebar
 * Clean collapsible sidebar with badge indicators and role-based access filtering.
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  ShieldCheck,
  CopyCheck,
  BarChart3,
  QrCode,
  PieChart,
  Bell,
  FileText,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building,
  ShieldAlert,
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: User;
  validationIssueCount: number;
  duplicateClusterCount: number;
  unreadAlertCount: number;
  hasIntakeBreach: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  currentUser,
  validationIssueCount,
  duplicateClusterCount,
  unreadAlertCount,
  hasIntakeBreach,
}) => {
  const isAicteAdmin = currentUser.role === 'aicte_admin';
  const isVerifier = currentUser.role === 'verifier';

  const navItems = [
    {
      id: 'overview',
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      badge: null,
      visible: true,
    },
    {
      id: 'registry',
      label: 'APAAR Student Registry',
      icon: Users,
      badge: null,
      visible: !isVerifier,
    },
    {
      id: 'upload',
      label: 'Student Data Upload',
      icon: UploadCloud,
      badge: null,
      visible: !isVerifier,
    },
    {
      id: 'validation',
      label: 'APAAR Validation Centre',
      icon: ShieldCheck,
      badge: validationIssueCount > 0 ? { count: validationIssueCount, color: 'bg-red-500/80 text-white' } : null,
      visible: !isVerifier,
    },
    {
      id: 'duplicates',
      label: 'Duplicate Detection Centre',
      icon: CopyCheck,
      badge: duplicateClusterCount > 0 ? { count: duplicateClusterCount, color: 'bg-amber-500/80 text-white' } : null,
      visible: !isVerifier,
    },
    {
      id: 'intake',
      label: 'Enrolment & Intake Monitoring',
      icon: BarChart3,
      badge: hasIntakeBreach ? { count: 'ALERT', color: 'bg-red-600 text-white animate-pulse' } : null,
      visible: !isVerifier,
    },
    {
      id: 'verification',
      label: 'Secure Student Verification',
      icon: QrCode,
      badge: null,
      visible: true,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: PieChart,
      badge: null,
      visible: true,
    },
    {
      id: 'alerts',
      label: 'Alerts & Notifications',
      icon: Bell,
      badge: unreadAlertCount > 0 ? { count: unreadAlertCount, color: 'bg-cyan-500 text-black font-bold' } : null,
      visible: true,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: FileText,
      badge: null,
      visible: !isVerifier,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: UserCheck,
      badge: null,
      visible: isAicteAdmin,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      visible: true,
    },
  ];

  return (
    <aside
      className={`relative z-30 transition-all duration-300 flex flex-col bg-[#0e1730] border-r border-[#1e2f58] text-slate-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3.5 top-6 z-40 w-7 h-7 bg-[#152244] border border-[#2b3e70] rounded-full text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? 'NAV' : 'Core Modules'}
        </div>

        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#152347]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${item.badge.color}`}
                  >
                    {item.badge.count}
                  </span>
                )}

                {/* Collapsed view indicator dot/badge */}
                {collapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0e1730]"></span>
                )}
              </button>
            );
          })}
      </div>

      {/* Institutional Context Card at bottom */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-[#131f3f] border border-[#213564] text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
            <Building className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] truncate">
              {currentUser.institutionName ? currentUser.institutionName.split(' ')[0] : 'AICTE Central Node'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">
            {currentUser.institutionName || 'National Academic Depository'}
          </p>
          <div className="mt-2 pt-2 border-t border-[#1e2f58] flex items-center justify-between text-[10px] text-slate-400">
            <span>Academic Year:</span>
            <span className="text-cyan-400 font-mono font-medium">2024–2025</span>
          </div>
        </div>
      )}
    </aside>
  );
};
