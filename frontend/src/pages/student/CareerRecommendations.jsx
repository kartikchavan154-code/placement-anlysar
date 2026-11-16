import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/api';
import {
  Compass,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Briefcase
} from 'lucide-react';

export const CareerRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user?.studentId) return;
    try {
      setLoading(true);
      const res = await aiService.getCareerRecommendations(user.studentId);
      setRecommendations(res.data);
    } catch (err) {
      console.error('Failed to load career recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = recommendations[activeTab];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            AI Career Intelligence Engine
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Personalized Career Roadmaps & Skill Gap Analysis
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Discover high-demand target roles matching your current skills, identify gap areas, and follow an actionable learning path.
        </p>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium text-slate-500">Synthesizing personalized learning roadmaps with AI...</p>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-6">
          {/* Target Role Selector Tabs */}
          <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-2">
            {recommendations.map((rec, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  activeTab === index
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{rec.jobRole}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    activeTab === index ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {rec.matchPercentage}% Fit
                </span>
              </button>
            ))}
          </div>

          {selectedRole && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Role Overview & Gap Breakdown */}
              <div className="space-y-6">
                {/* Fit Summary Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Role Compatibility
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedRole.marketDemand} Demand
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {selectedRole.jobRole}
                  </h3>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Average Campus Package:</span>
                    <span className="text-sm font-extrabold text-emerald-600">{selectedRole.averageStartingSalary}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Why This Role Fits You
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedRole.rationale}
                    </p>
                  </div>
                </div>

                {/* Matched vs Missing Skills */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Your Acquired Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRole.matchedSkills?.map((s, idx) => (
                        <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Priority Skill Gaps
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRole.missingSkills?.map((s, idx) => (
                        <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Certifications */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    Recommended Industry Credentials
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {selectedRole.recommendedCertifications?.map((cert, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></span>
                        <span className="font-medium">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Learning Roadmap */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 card-shadow space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Step-by-Step Accelerated Learning Roadmap
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Follow this structured timeline to bridge skill gaps before final campus placement interviews.
                  </p>
                </div>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-indigo-100">
                  {selectedRole.learningRoadmap?.map((step) => (
                    <div key={step.stepNumber} className="relative flex items-start gap-4">
                      {/* Step Number Circle */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-indigo-600/30 flex-shrink-0 z-10">
                        {step.stepNumber}
                      </div>

                      {/* Step Details Box */}
                      <div className="flex-1 p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-bold text-sm text-slate-900">{step.topic}</h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 self-start sm:self-auto">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.description}
                        </p>

                        {step.learningResources && step.learningResources.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-2">
                            {step.learningResources.map((res, rIdx) => (
                              <span
                                key={rIdx}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200"
                              >
                                <BookOpen className="w-3 h-3 text-slate-400" />
                                {res}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 card-shadow">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Career Analysis Available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Update your skills in the profile module to generate tailored career roadmaps.
          </p>
        </div>
      )}
    </div>
  );
};

