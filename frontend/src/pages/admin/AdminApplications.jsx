import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  Send,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Edit2,
  User,
  Briefcase,
  Award,
  Phone
} from 'lucide-react';

export const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  // Status update form state
  const [newStatus, setNewStatus] = useState('APPLIED');
  const [interviewDate, setInterviewDate] = useState('');
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getAll();
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setInterviewDate(app.interviewDate ? app.interviewDate.substring(0, 16) : '');
    setFeedback(app.feedback || '');
    setNotes(app.notes || '');
    setIsModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdating(true);
    setAlert({ type: '', text: '' });

    try {
      const payload = {
        status: newStatus,
        interviewDate: interviewDate ? interviewDate + ':00' : null,
        feedback,
        notes,
      };

      const res = await applicationService.updateStatus(selectedApp.id, payload);
      setApplications(applications.map((a) => (a.id === selectedApp.id ? res.data : a)));
      setAlert({ type: 'success', text: `Application status updated to ${newStatus} successfully!` });
      setIsModalOpen(false);
      setTimeout(() => setAlert({ type: '', text: '' }), 4000);
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to update application status.' });
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch =
      search === '' ||
      app.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      app.studentDepartment?.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      app.company?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Applicant Management & Shortlisting</h1>
        <p className="text-xs md:text-sm text-slate-500">
          Review candidate submissions, update recruitment interview stages, and deliver placement feedback.
        </p>
      </div>

      {/* Alert Notification */}
      {alert.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-sm ${
            alert.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{alert.text}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 card-shadow flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, company, or job role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-60 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Application Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="TECHNICAL_ROUND">Technical Round</option>
            <option value="HR_ROUND">HR Round</option>
            <option value="SELECTED">Selected / Placed</option>
            <option value="REJECTED">Not Selected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 md:px-6">Candidate</th>
                <th className="py-3.5 px-4">Department & CGPA</th>
                <th className="py-3.5 px-4">Job Role & Company</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4">Interview Schedule</th>
                <th className="py-3.5 px-4 text-right">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading student applications...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <p className="font-bold text-slate-900 text-sm">{app.studentName}</p>
                      <p className="text-[11px] text-slate-400">{app.studentEmail}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-700">{app.studentDepartment}</p>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                        CGPA: {app.studentCgpa}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{app.jobTitle}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">{app.company}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-4">
                      {app.interviewDate ? (
                        <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1 w-max">
                          <Calendar className="w-3 h-3" />
                          {new Date(app.interviewDate).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Not scheduled</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No applications match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Status Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Recruitment Stage"
        maxWidth="max-w-xl"
      >
        {selectedApp && (
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-800 text-sm">{selectedApp.studentName}</p>
              <p className="text-slate-500">
                Applying for: <span className="font-semibold text-slate-700">{selectedApp.jobTitle}</span> at {selectedApp.company}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Recruitment Stage / Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="APPLIED">Applied</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="TECHNICAL_ROUND">Technical Round</option>
                <option value="HR_ROUND">HR Round</option>
                <option value="SELECTED">Selected / Offer Extended</option>
                <option value="REJECTED">Not Selected / Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Interview Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Student Visible Feedback
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Cleared round 1 with high scores. Focus on Spring Boot fundamentals for the upcoming round."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Internal Placement Cell Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes (e.g. interviewer assigned: Panel A)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Stage Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

