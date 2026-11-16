import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Send,
  Calendar,
  MessageSquare,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  Briefcase,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export const ApplicationTracker = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user?.studentId) return;
    try {
      setLoading(true);
      const res = await applicationService.getByStudent(user.studentId);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const getStageStep = (status) => {
    switch (status) {
      case 'APPLIED':
        return 1;
      case 'UNDER_REVIEW':
        return 2;
      case 'SHORTLISTED':
        return 3;
      case 'TECHNICAL_ROUND':
        return 4;
      case 'HR_ROUND':
        return 5;
      case 'SELECTED':
        return 6;
      case 'REJECTED':
        return -1;
      default:
        return 1;
    }
  };

  const stages = [
    { label: 'Applied', step: 1 },
    { label: 'Shortlisted', step: 3 },
    { label: 'Technical Round', step: 4 },
    { label: 'HR Round', step: 5 },
    { label: 'Selected', step: 6 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Status Tracker</h1>
        <p className="text-xs md:text-sm text-slate-500">
          Monitor your progression across recruitment stages, view interview schedules, and inspect feedback.
        </p>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium text-slate-500">Loading your recruitment pipeline...</p>
          </div>
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStep = getStageStep(app.status);
            const isRejected = app.status === 'REJECTED';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 card-shadow space-y-6"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                      {app.company?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {app.company} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <Link
                      to="/interview-prep"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors border border-indigo-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Mock Prep
                    </Link>
                  </div>
                </div>

                {/* Progress Stepper Pipeline */}
                {!isRejected ? (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between w-full">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${Math.min(((currentStep - 1) / (stages.length - 1)) * 100, 100)}%`,
                        }}
                      />

                      {stages.map((stage) => {
                        const isDone = currentStep >= stage.step;
                        const isCurrent = currentStep === stage.step;

                        return (
                          <div key={stage.step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {isDone ? '✓' : stage.step}
                            </div>
                            <span
                              className={`text-[11px] font-semibold mt-2 whitespace-nowrap ${
                                isCurrent ? 'text-indigo-600 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                    This application was not selected for further rounds. Review our AI career recommendations to bridge skill gaps.
                  </div>
                )}

                {/* Details Grid: Interview Date & Feedback */}
                {(app.interviewDate || app.feedback) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                    {app.interviewDate && (
                      <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                        <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          Scheduled Interview Round
                        </span>
                        <p className="text-slate-600 font-medium">
                          {new Date(app.interviewDate).toLocaleString([], {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    )}

                    {app.feedback && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                          Placement Cell Feedback
                        </span>
                        <p className="text-slate-600">{app.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 card-shadow">
          <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Applications Submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            You haven't applied to any job postings yet. Browse campus placement openings to begin!
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            Explore Available Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

