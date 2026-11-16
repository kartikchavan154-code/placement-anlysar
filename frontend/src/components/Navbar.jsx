import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, Sparkles, Menu, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500 hidden sm:inline">
            Campus Placement & Career Assistant
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
            AI Powered
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification pill */}
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User profile dropdown / info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.fullName || 'User'}
            </p>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Placement Admin</span>
                </>
              ) : (
                'Student Candidate'
              )}
            </p>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

