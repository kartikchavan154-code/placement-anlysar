import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';
import {
  Users,
  Search,
  Filter,
  Award,
  BookOpen,
  Phone,
  Mail,
  Linkedin,
  Github,
  CheckCircle2
} from 'lucide-react';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [minCgpa, setMinCgpa] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [department, minCgpa]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (department !== 'All') params.department = department;
      if (minCgpa) params.minCgpa = parseFloat(minCgpa);
      const res = await studentService.getAllStudents(params);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.studentIdNum?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registered Student Directory</h1>
        <p className="text-xs md:text-sm text-slate-500">
          Inspect academic standing, CGPA performance cutoffs, and verified technical proficiencies.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 card-shadow flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, USN, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Eng</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Comm</option>
          </select>

          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="Min CGPA"
            value={minCgpa}
            onChange={(e) => setMinCgpa(e.target.value)}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 md:px-6">Candidate Details</th>
                <th className="py-3.5 px-4">Roll / USN</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">Graduation</th>
                <th className="py-3.5 px-4">Verified Skill Tags</th>
                <th className="py-3.5 px-4">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading student directory...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <p className="font-bold text-slate-900 text-sm">{s.fullName}</p>
                      <p className="text-[11px] text-slate-400">{s.email}</p>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-700">
                      {s.studentIdNum || 'N/A'}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{s.department}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded text-xs">
                        {s.cgpa}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{s.graduationYear}</td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {s.skills && s.skills.length > 0 ? (
                          s.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None logged</span>
                        )}
                        {s.skills && s.skills.length > 3 && (
                          <span className="text-[10px] font-semibold text-indigo-600 self-center">
                            +{s.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      {s.phone && <p className="text-[11px] text-slate-600">{s.phone}</p>}
                      <div className="flex items-center gap-2 text-slate-400">
                        {s.linkedinUrl && (
                          <a href={s.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-600">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {s.githubUrl && (
                          <a href={s.githubUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-600">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

