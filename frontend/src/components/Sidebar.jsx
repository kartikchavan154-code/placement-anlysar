import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Send,
  Compass,
  MessageSquareCode,
  Building2,
  Users,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isStudent, isAdmin } = useAuth();

  const studentNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Student Profile', path: '/profile', icon: User },
    { label: 'AI Resume Analyzer', path: '/resume-analyzer', icon: FileText, aiBadge: true },
    { label: 'Placement Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Application Tracker', path: '/applications', icon: Send },
    { label: 'AI Career Roadmap', path: '/career-recommendations', icon: Compass, aiBadge: true },
    { label: 'AI Mock Interview', path: '/interview-prep', icon: MessageSquareCode, aiBadge: true },
  ];

  const adminNav = [
    { label: 'Admin Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Job Postings', path: '/admin/jobs', icon: Briefcase },
    { label: 'Student Applications', path: '/admin/applications', icon: Send },
    { label: 'Registered Students', path: '/admin/students', icon: Users },
  ];

  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">
                Career<span className="text-indigo-400">Pulse</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-0.5">
                Campus Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            {isAdmin ? 'Administrative Modules' : 'Placement Modules'}
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.aiBadge && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card at Bottom */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
              {isAdmin ? 'AD' : 'ST'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
