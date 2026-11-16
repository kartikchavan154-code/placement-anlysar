import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Users,
  Building2,
  Briefcase,
  Send,
  Award,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert departmentWisePlacement map to chart array
  const departmentChartData = stats?.departmentWisePlacement
    ? Object.entries(stats.departmentWisePlacement).map(([dept, count]) => ({
        department: dept.length > 15 ? dept.substring(0, 15) + '...' : dept,
        placedCount: count,
      }))
    : [];

  // Convert applicationStatusDistribution map to chart array
  const statusColors = {
    APPLIED: '#3b82f6',
    UNDER_REVIEW: '#f59e0b',
    SHORTLISTED: '#8b5cf6',
    TECHNICAL_ROUND: '#6366f1',
    HR_ROUND: '#06b6d4',
    SELECTED: '#10b981',
    REJECTED: '#f43f5e',
  };

  const statusChartData = stats?.applicationStatusDistribution
    ? Object.entries(stats.applicationStatusDistribution)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status.replace('_', ' '),
          value: count,
          color: statusColors[status] || '#94a3b8',
        }))
    : [];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Aggregating campus placement analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Admin Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Administrative Overview
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Placement Cell Analytics & Drive Control
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Real-time tracking of participating corporate recruiters, student applicants, and department placement percentages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/jobs"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" /> Manage Job Postings
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Registered Students"
          value={stats?.totalStudents || 0}
          subtitle="Enrolled candidates"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Visiting Companies"
          value={stats?.totalCompanies || 0}
          subtitle="Corporate partners"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Job Openings"
          value={stats?.totalJobPostings || 0}
          subtitle="Active campus drives"
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Total Applications"
          value={stats?.totalApplicationsCount || 0}
          subtitle="Processed submissions"
          icon={Send}
          color="amber"
        />
        <StatCard
          title="Placement Rate"
          value={`${stats?.placementPercentage || 0}%`}
          subtitle={`${stats?.totalSelectedStudents || 0} Placed Students`}
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-Wise Placements */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              Department-Wise Placed Students
            </h3>
            <p className="text-xs text-slate-500">Number of offers secured by academic department</p>
          </div>

          <div className="h-72 w-full pt-4">
            {departmentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none' }}
                  />
                  <Bar dataKey="placedCount" name="Placed Students" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No departmental data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600" />
              Recruitment Funnel & Status Distribution
            </h3>
            <p className="text-xs text-slate-500">Live breakdown across interview rounds and placements</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No applications recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Callout Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/jobs"
          className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow card-hover flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Post New Campus Drive</h4>
            <p className="text-xs text-slate-500 mt-0.5">Publish roles, CGPA criteria, and dates</p>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </Link>

        <Link
          to="/admin/applications"
          className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow card-hover flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Manage Submissions</h4>
            <p className="text-xs text-slate-500 mt-0.5">Shortlist candidates & schedule interviews</p>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-600" />
        </Link>

        <Link
          to="/admin/students"
          className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow card-hover flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Student Directory</h4>
            <p className="text-xs text-slate-500 mt-0.5">Inspect academic CGPA & verified skill sets</p>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </Link>
      </div>
    </div>
  );
};

