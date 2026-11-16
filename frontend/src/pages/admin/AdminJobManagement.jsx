import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/api';
import { Modal } from '../../components/Modal';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  Building2,
  Calendar,
  Award,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('CREATE'); // CREATE or EDIT
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    company: '',
    location: '',
    jobType: 'Full-Time',
    description: '',
    eligibleDepartments: 'Computer Science, Information Technology',
    requiredSkills: '',
    minCgpa: '7.5',
    salaryPackage: '12 - 18 LPA',
    applicationDeadline: '',
    openings: 5,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getAll({ search });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('CREATE');
    setFormData({
      id: null,
      title: '',
      company: '',
      location: 'Bengaluru / Hybrid',
      jobType: 'Full-Time',
      description: '',
      eligibleDepartments: 'Computer Science, Information Technology',
      requiredSkills: 'Java, Spring Boot, React, SQL',
      minCgpa: '7.5',
      salaryPackage: '12 - 16 LPA',
      applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      openings: 5,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setModalMode('EDIT');
    setFormData({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location || '',
      jobType: job.jobType || 'Full-Time',
      description: job.description || '',
      eligibleDepartments: job.eligibleDepartments || '',
      requiredSkills: job.requiredSkills || '',
      minCgpa: job.minCgpa !== undefined ? job.minCgpa : 0.0,
      salaryPackage: job.salaryPackage || '',
      applicationDeadline: job.applicationDeadline || '',
      openings: job.openings || 1,
      isActive: job.isActive !== undefined ? job.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? All student applications for it will be removed.')) {
      return;
    }
    try {
      await jobService.delete(id);
      setAlert({ type: 'success', text: 'Job posting deleted successfully!' });
      setJobs(jobs.filter((j) => j.id !== id));
      setTimeout(() => setAlert({ type: '', text: '' }), 4000);
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to delete job posting.' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        minCgpa: parseFloat(formData.minCgpa) || 0.0,
        openings: parseInt(formData.openings) || 1,
      };

      if (modalMode === 'CREATE') {
        const res = await jobService.create(payload);
        setJobs([res.data, ...jobs]);
        setAlert({ type: 'success', text: 'New job posting published successfully!' });
      } else {
        const res = await jobService.update(formData.id, payload);
        setJobs(jobs.map((j) => (j.id === formData.id ? res.data : j)));
        setAlert({ type: 'success', text: 'Job posting details updated successfully!' });
      }
      setIsModalOpen(false);
      setTimeout(() => setAlert({ type: '', text: '' }), 4000);
    } catch (err) {
      setAlert({ type: 'error', text: err.response?.data?.message || 'Failed to save job posting.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Job Management</h1>
          <p className="text-xs md:text-sm text-slate-500">
            Create, update, and manage company recruitment drives, deadlines, and eligibility cutoffs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Job Posting
        </button>
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

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 card-shadow">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drives by job title, company..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Job Postings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 md:px-6">Job Role & Company</th>
                <th className="py-3.5 px-4">Type & Location</th>
                <th className="py-3.5 px-4">Min CGPA</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Openings</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Applicants</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading job postings...
                  </td>
                </tr>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <p className="font-bold text-slate-900 text-sm">{job.title}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">{job.company}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-700">{job.jobType}</span>
                      <p className="text-[11px] text-slate-400">{job.location}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {job.minCgpa}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600">{job.salaryPackage}</td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{job.openings}</td>
                    <td className="py-4 px-4 text-slate-500">
                      {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Rolling'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800">{job.applicantCount || 0}</span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(job)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Job Posting"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Job Posting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No placement job postings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'CREATE' ? 'Create Placement Job Posting' : 'Update Job Posting'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Associate Software Engineer"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google India"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Bengaluru / Hybrid"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Job Type
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship + PPO">Internship + PPO</option>
                <option value="Summer Internship">Summer Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Salary Package
              </label>
              <input
                type="text"
                required
                value={formData.salaryPackage}
                onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                placeholder="14 - 18 LPA"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Job Description & Responsibilities
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe candidate requirements, team roles, and interview process..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Eligible Departments
              </label>
              <input
                type="text"
                value={formData.eligibleDepartments}
                onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })}
                placeholder="Computer Science, Information Technology, All"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Required Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                placeholder="Java, Spring Boot, React, SQL, Git"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Minimum CGPA Criteria
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={formData.minCgpa}
                onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                placeholder="7.5"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Openings Count
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                placeholder="5"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
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
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : modalMode === 'CREATE' ? 'Publish Job' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

