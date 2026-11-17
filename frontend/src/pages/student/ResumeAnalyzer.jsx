import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { resumeService } from '../../services/api';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export const ResumeAnalyzer = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [targetJobRole, setTargetJobRole] = useState('Full Stack Software Developer');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLatestAnalysis(targetJobRole);
  }, [user, targetJobRole]);

  const fetchLatestAnalysis = async (role = targetJobRole) => {
    if (!user?.studentId) return;
    try {
      setFetchingExisting(true);
      const res = await resumeService.getLatest(user.studentId, role);
      if (res.data) {
        setAnalysis(res.data);
      }
    } catch (err) {
      // Non-critical, student may not have uploaded yet
    } finally {
      setFetchingExisting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF format resume.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Resume file size exceeds the 10MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF resume to analyze.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await resumeService.upload(user.studentId, file, targetJobRole);
      setAnalysis(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload and analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            AI Resume & ATS Optimization Engine
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI Resume Analyzer & Skill Gap Evaluator
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Upload your PDF resume to extract technical credentials, assess ATS match scores, and uncover high-demand missing skills.
        </p>
      </div>

      {/* Upload & Configuration Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 card-shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Upload Resume (PDF format, max 10MB)
            </label>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
                  : file
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    file ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                  }`}
                >
                  {file ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                </div>

                {file ? (
                  <div>
                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Drag & Drop your resume PDF here, or <span className="text-indigo-600">Browse</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Secure processing: files are kept in private campus storage
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Target Job Role Filter */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Job Role
              </label>
              <select
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Full Stack Software Developer">Full Stack Software Developer</option>
                <option value="Backend Java Engineer">Backend Java Engineer</option>
                <option value="Frontend React Developer">Frontend React Developer</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                <option value="Data & Machine Learning Engineer">Data & Machine Learning Engineer</option>
                <option value="Software Development Engineer in Test">Software Development Engineer in Test</option>
              </select>
              <p className="text-[11px] text-slate-400">
                The ATS scanner compares your extracted skills directly against expectations for this role.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUploadAndAnalyze}
              disabled={loading || !file}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing PDF Structure...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Resume Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 card-shadow flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* ATS Score Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-inner">
                <div className="text-center">
                  <span className="text-2xl md:text-3xl font-extrabold text-indigo-700">
                    {analysis.matchScore}
                  </span>
                  <span className="text-[10px] block font-bold uppercase tracking-wider text-indigo-400">
                    / 100
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ATS Match Rating
                </span>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">
                  {analysis.matchScore >= 85
                    ? 'Excellent ATS Alignment!'
                    : analysis.matchScore >= 70
                    ? 'Good Profile Match - Small Gaps'
                    : 'Moderate Alignment - Needs Tailoring'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  File: <span className="font-semibold text-slate-700">{analysis.fileName}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {analysis.extractedSkills?.length || 0} Skills Recognized
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {analysis.missingSkills?.length || 0} Skill Gaps Found
              </span>
            </div>
          </div>

          {/* Skill Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extracted Skills */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Recognized Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.extractedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Missing / Recommended Skills for {targetJobRole}
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-4 h-4 text-indigo-600" />
                Key Profile Strengths
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {analysis.strengths?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                Actionable Resume Improvements
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {analysis.suggestions?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

