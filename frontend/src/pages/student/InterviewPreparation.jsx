import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/api';
import {
  MessageSquareCode,
  Sparkles,
  Award,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Send,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  TrendingUp,
  Target
} from 'lucide-react';

export const InterviewPreparation = () => {
  const { user } = useAuth();

  const [jobRole, setJobRole] = useState('Full Stack Software Engineer');
  const [category, setCategory] = useState('TECHNICAL'); // TECHNICAL, HR, MCQ_QUIZ
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Student answer state for open-ended questions
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [revealedSampleAnswers, setRevealedSampleAnswers] = useState({});

  // MCQ state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    setEvaluation(null);
    setStudentAnswer('');
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setSelectedQuestionIndex(0);

    try {
      const res = await aiService.generateInterviewQuestions(jobRole, category, 5);
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to generate interview questions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async (e) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;
    setEvaluating(true);
    setEvaluation(null);

    const currentQ = questions[selectedQuestionIndex];
    try {
      const res = await aiService.evaluateAnswer({
        jobRole,
        category,
        question: currentQ.question,
        studentAnswer,
      });
      setEvaluation(res.data);
    } catch (err) {
      console.error('Failed to evaluate answer', err);
    } finally {
      setEvaluating(false);
    }
  };

  const toggleSampleAnswer = (index) => {
    setRevealedSampleAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            AI Mock Interview Coach
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI-Powered Placement Interview Preparation
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Simulate rigorous campus placement technical interviews, practice behavioral HR scenarios, or take placement aptitude MCQs with immediate AI feedback.
        </p>
      </div>

      {/* Control Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 card-shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Target Placement Role
            </label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
              <option value="Backend Java & Spring Boot Developer">Backend Java & Spring Developer</option>
              <option value="Frontend React & TypeScript Specialist">Frontend React Developer</option>
              <option value="Cloud Systems & DevOps Engineer">Cloud & DevOps Engineer</option>
              <option value="Data & Machine Learning Engineer">Data & Machine Learning Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Interview Evaluation Mode
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="TECHNICAL">Technical Deep-Dive & Architecture</option>
              <option value="HR">Behavioral & HR Round (STAR Method)</option>
              <option value="MCQ_QUIZ">Online Placement Screening MCQ Quiz</option>
            </select>
          </div>

          <button
            type="button"
            onClick={fetchQuestions}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Interview Session
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {questions.length > 0 ? (
        category === 'MCQ_QUIZ' ? (
          /* MCQ Quiz Mode */
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 card-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Placement Assessment MCQ Quiz</h3>
                <p className="text-xs text-slate-500">Test core programming, systems, and database concepts</p>
              </div>

              {quizSubmitted && (
                <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-extrabold flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Your Score: {calculateQuizScore()} / {questions.length} (
                  {Math.round((calculateQuizScore() / questions.length) * 100)}%)
                </div>
              )}
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-slate-900 text-sm leading-relaxed">
                      <span className="text-indigo-600 font-extrabold mr-1">Q{idx + 1}.</span> {q.question}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options?.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = q.correctOptionIndex === optIdx;

                      let btnStyle = 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-bold';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${btnStyle}`}
                        >
                          <span className="font-bold mr-2 text-slate-400">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && q.explanation && (
                    <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium">
                      <span className="font-bold text-indigo-700">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all disabled:opacity-40"
                >
                  Submit Quiz & Calculate Score
                </button>
              ) : (
                <button
                  type="button"
                  onClick={fetchQuestions}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Try Another Set
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Technical / HR Interview Simulator */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Questions List Sidebar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 card-shadow space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                Questions ({questions.length})
              </h3>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestionIndex(idx);
                      setEvaluation(null);
                      setStudentAnswer('');
                    }}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition-all border ${
                      selectedQuestionIndex === idx
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="font-extrabold text-indigo-600 block mb-0.5">
                      Question {idx + 1}
                    </span>
                    <p className="line-clamp-2">{q.question}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Input & Evaluation Area */}
            <div className="lg:col-span-2 space-y-6">
              {questions[selectedQuestionIndex] && (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 card-shadow space-y-6">
                  {/* Current Question */}
                  <div className="space-y-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                        Question {selectedQuestionIndex + 1} of {questions.length}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {questions[selectedQuestionIndex].difficulty}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                      {questions[selectedQuestionIndex].question}
                    </h3>
                  </div>

                  {/* Expected Key Points Preview */}
                  {questions[selectedQuestionIndex].expectedKeyPoints && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-indigo-600" /> Key Topics Interviewers Look For:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                        {questions[selectedQuestionIndex].expectedKeyPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Student Answer Textarea */}
                  <form onSubmit={handleEvaluateAnswer} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Spoken / Written Response
                      </label>
                      <textarea
                        rows={6}
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        placeholder="Type your structured technical answer or STAR method response here..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs md:text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSampleAnswer(selectedQuestionIndex)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {revealedSampleAnswers[selectedQuestionIndex] ? 'Hide Model Answer' : 'View Sample Answer'}
                      </button>

                      <button
                        type="submit"
                        disabled={evaluating || !studentAnswer.trim()}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 disabled:opacity-40"
                      >
                        {evaluating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> Evaluate My Answer
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Sample Answer Box */}
                  {revealedSampleAnswers[selectedQuestionIndex] && (
                    <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                      <span className="font-bold text-purple-900 block flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-purple-600" />
                        Senior Interviewer Sample Answer:
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {questions[selectedQuestionIndex].sampleAnswer}
                      </p>
                    </div>
                  )}

                  {/* AI Evaluation Feedback Card */}
                  {evaluation && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-pink-50/20 border border-indigo-200 space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 text-indigo-700 flex items-center justify-center font-extrabold text-lg shadow-sm">
                            {evaluation.score}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Assessment Score
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">
                              Performance Rating: <span className="text-indigo-600">{evaluation.rating}</span>
                            </h4>
                          </div>
                        </div>

                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                          AI Analyzed
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Candidate Strengths:
                          </span>
                          <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                            {evaluation.strengths?.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1.5">
                          <span className="font-bold text-amber-800 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Recommended Improvements:
                          </span>
                          <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                            {evaluation.improvements?.map((imp, idx) => (
                              <li key={idx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {evaluation.detailedFeedback && (
                        <div className="pt-2 text-xs text-slate-600 border-t border-indigo-100">
                          <span className="font-bold text-slate-800 block mb-0.5">Summary Verdict:</span>
                          <p>{evaluation.detailedFeedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 card-shadow">
          <MessageSquareCode className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Ready to Begin Mock Preparation?</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Select your target job role and interview format above, then click 'Generate Interview Session' to practice!
          </p>
          <button
            type="button"
            onClick={fetchQuestions}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-3.5 h-3.5" /> Start Practice Round
          </button>
        </div>
      )}
    </div>
  );
};
