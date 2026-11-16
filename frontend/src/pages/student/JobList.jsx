import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jobService, applicationService } from '../../services/api';
import { Modal } from '../../components/Modal';
import {
  Search,
  Filter,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Send,
  Users
} from 'lucide-react';

export const JobList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJobs();
  }, [user, search, department]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getAll({
        studentId: user?.studentId,
        search,
        department,
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!user?.studentId) return;
    setApplying(true);
    setActionMessage({ type: '', text: '' });

    try {
      await applicationService.apply(user.studentId, jobId);
      setActionMessage({
        type: 'success',
        text: 'Application submitted successfully! Track your stage in Application Tracker.',
      });
      // Refresh local list state
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, hasApplied: true, applicationStatus: 'APPLIED' } : j))
      );
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob((prev) => ({ ...prev, hasApplied: true, applicationStatus: 'APPLIED' }));
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application.',
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Opportunities</h1>
        <p className="text-xs md:text-sm text-slate-500">
          Discover company drives, check CGPA eligibility cutoffs, and submit applications directly.
        </p>
      </div>

      {/* Action Notification */}
      {actionMessage.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-sm ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Search & Department Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 card-shadow flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title, company, or skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full md:w-64 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science & Eng</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics & Comm</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="p-8 flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium text-slate-500">Fetching live campus opportunities...</p>
          </div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow card-hover flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Company & Type */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                    {job.company?.charAt(0) || 'C'}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {job.jobType}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedJob(job)}>
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{job.company}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Key Attributes */}
                <div className="pt-2 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-bold text-emerald-600">{job.salaryPackage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Rolling'}
                    </span>
                  </div>
                </div>

                {/* Required Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {job.requiredSkills?.split(',').slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700"
                    >
                      {s.trim()}
                    </span>
                  ))}
                  {job.requiredSkills?.split(',').length > 3 && (
                    <span className="text-[10px] text-slate-400 font-semibold self-center">
                      +{job.requiredSkills.split(',').length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Eligibility & Action footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  {job.isEligible === false ? (
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      CGPA &lt; {job.minCgpa}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ Eligible (Min {job.minCgpa})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="View Full Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {job.hasApplied ? (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                      Applied ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applying || job.isEligible === false}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 card-shadow">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Job Postings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or clear the department filter.
          </p>
        </div>
      )}

      {/* Job Details Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title || 'Job Specification'}
      >
        {selectedJob && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-lg text-slate-900">{selectedJob.company}</h4>
                <p className="text-xs text-slate-500">{selectedJob.location} • {selectedJob.jobType}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-600 block">
                  {selectedJob.salaryPackage}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {selectedJob.openings} Openings
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Role Description & Scope
              </h5>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedJob.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Minimum CGPA</span>
                <span className="font-bold text-slate-800 text-sm">{selectedJob.minCgpa || 'No Cutoff'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Eligible Departments</span>
                <span className="font-bold text-slate-800 text-sm">{selectedJob.eligibleDepartments || 'All'}</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Required Technical Proficiencies
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.requiredSkills?.split(',').map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>

              {selectedJob.hasApplied ? (
                <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                  Applied ✓
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={applying || selectedJob.isEligible === false}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-40"
                >
                  {selectedJob.isEligible === false ? 'CGPA Ineligible' : 'Confirm Application'}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

