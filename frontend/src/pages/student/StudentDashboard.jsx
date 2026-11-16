import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService, jobService, applicationService } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Briefcase,
  Send,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.studentId) return;
    try {
      setLoading(true);
      const res = await analyticsService.getStudentStats(user.studentId);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load student dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const chartColors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  const applicationChartData = [
    { name: 'Applied', count: stats?.totalAppliedJobs || 0, fill: '#3b82f6' },
    { name: 'Shortlisted', count: stats?.totalShortlisted || 0, fill: '#8b5cf6' },
    { name: 'Offers Received', count: stats?.totalSelected || 0, fill: '#10b981' },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Compiling your placement metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Welcome back to Campus Placement Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Hello, {user?.fullName}! 👋
            </h1>
            <p className="text-sm text-indigo-100/90 max-w-xl">
              Track your recruitment pipeline, analyze resume compatibility, and test your interview skills with AI mock sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/resume-analyzer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs md:text-sm hover:bg-indigo-50 transition-all shadow-md"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              Scan Resume
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs md:text-sm transition-all border border-indigo-400/30"
            >
              <Briefcase className="w-4 h-4" />
              Explore Jobs
            </Link>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/2 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Available Openings"
          value={stats?.totalAvailableJobs || 0}
          subtitle="Active campus drives"
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Applications Sent"
          value={stats?.totalAppliedJobs || 0}
          subtitle="Positions applied"
          icon={Send}
          color="blue"
        />
        <StatCard
          title="Shortlisted / Interviews"
          value={stats?.totalShortlisted || 0}
          subtitle="Ongoing interview rounds"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Placement Offers"
          value={stats?.totalSelected || 0}
          subtitle={stats?.totalSelected > 0 ? "🎉 Congratulations!" : "Targeting dream offer"}
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Profile Readiness & Pipeline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Readiness Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">Profile Placement Readiness</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {stats?.profileCompletionPercentage || 0}% Complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${stats?.profileCompletionPercentage || 20}%` }}
            ></div>
          </div>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Academic Details & CGPA
              </span>
              <span className="font-semibold text-slate-800">Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${stats?.skillsCount > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                Technical Skills ({stats?.skillsCount || 0} added)
              </span>
              <Link to="/profile" className="text-indigo-600 hover:underline font-semibold">
                Manage
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                AI Resume Optimization
              </span>
              <Link to="/resume-analyzer" className="text-indigo-600 hover:underline font-semibold">
                Scan ATS
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                AI Mock Interview Practice
              </span>
              <Link to="/interview-prep" className="text-indigo-600 hover:underline font-semibold">
                Practice
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/profile"
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              Update Full Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Application Stage Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Your Application Pipeline</h3>
              <p className="text-xs text-slate-500">Real-time status of submitted applications</p>
            </div>
            <Link to="/applications" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationChartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <XAxis type="number" allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {applicationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Jobs & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Jobs List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 card-shadow">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Recommended for You
              </h3>
              <p className="text-xs text-slate-500">Matching your CGPA criteria and engineering major</p>
            </div>
            <Link to="/jobs" className="text-xs font-bold text-indigo-600 hover:underline">
              Browse All Jobs
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentRecommendedJobs && stats.recentRecommendedJobs.length > 0 ? (
              stats.recentRecommendedJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{job.title}</span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {job.company} • {job.location} • <span className="font-semibold text-emerald-600">{job.salaryPackage}</span>
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.requiredSkills?.split(',').slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.hasApplied ? (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        ✓ Applied
                      </span>
                    ) : (
                      <Link
                        to="/jobs"
                        className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors text-center"
                      >
                        Apply Now
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No job recommendations available at the moment.
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications Mini Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base">Recent Submissions</h3>
              <Link to="/applications" className="text-xs font-bold text-indigo-600 hover:underline">
                Tracker
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                stats.recentApplications.map((app) => (
                  <div key={app.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                        {app.jobTitle}
                      </p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {app.company}
                    </p>
                    {app.interviewDate && (
                      <p className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Interview: {new Date(app.interviewDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  You haven't submitted any applications yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Link
              to="/interview-prep"
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Compass className="w-4 h-4" /> Start AI Interview Prep
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

